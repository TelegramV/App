//MTProto Intermediate Obfuscated Codec W.I.P.
//Copyright 2019 Oleg Tsenilov
//https://github.com/OTsenilov

import isaac from '../utils/isaac'
import aesjs from '../utils/aes'

export function mt_write_bytes(offset, length, input, buffer)
{
    for(var i = 0; i < length; ++i)
    {
        buffer.setUint8(i + offset, input[i]);
    }
}

export function mt_write_uint32(offset, value, buffer)
{
    buffer.setUint32(offset, value, true);
}

function mt_read_uint32(offset, buffer)
{
    return buffer.getUint32(offset, true);
}

function mt_write_uint64(offset, left, right, buffer)
{
    buffer.setUint32(offset, left, true);
    buffer.setUint32(offset + 4, right, true);
}

function mt_get_random_num_secure(max) {
    //currently using ISAAC, not as secure as SJCL, but less size, 
    //better compatibility and doesn't depend on mouse moves
    max = Math.floor(max);
    return Math.floor(isaac.random() * (max + 1));
}

/*
WARNING:
https://crypto.stanford.edu/sjcl/acsac.pdf

Javascript exposes a random number generator as Math.random. 
Unfortunately, except in Safari on Windows (and Safari on Mac after revision 39510), 
this function is not cryptographically strong, and determining its strength would rely on 
potentially brittle browser version detection code in Javascript.

mt_get_random_num_secure is very recommended for crypto
*/
function mt_get_random_num_unsecure(max) {
    max = Math.floor(max);
    return Math.floor(Math.random() * (max + 1));
}

var aes_encryptors = {};
var aes_decryptors = {};
var obfuscation_init = {};
function mt_init_obfuscation(out_buffer_view, url)
{
    var out_buffer_offset = 0;

    var obfuscation_buffer = new ArrayBuffer(64);
    var obfuscation_buffer_view = new DataView(obfuscation_buffer);
    var obfuscation_buffer_offset = 0;

    for(;;)
    {
        var f = mt_get_random_num_secure(0xFFFFFFFF);
        var s = mt_get_random_num_secure(0xFFFFFFFF);

        if((f & 0xFF) != 0xef && f != 0xdddddddd && f != 0xeeeeeeee 
        && f != 0x504f5354 && f != 0x474554 && f != 0x48454144 && s != 0x00000000)
        {
            mt_write_uint32(obfuscation_buffer_offset, f, obfuscation_buffer_view);
            obfuscation_buffer_offset += 4;
            mt_write_uint32(obfuscation_buffer_offset, s, obfuscation_buffer_view);
            obfuscation_buffer_offset += 4;
            break;
        }
    }
    for(var i = 0; i < 12; ++i)
    {
        mt_write_uint32(obfuscation_buffer_offset, mt_get_random_num_secure(0xFFFFFFFF), obfuscation_buffer_view);
        obfuscation_buffer_offset += 4;
    }

    mt_write_uint32(obfuscation_buffer_offset, 0xeeeeeeee, obfuscation_buffer_view);
    obfuscation_buffer_offset += 4;

    obfuscation_buffer_view.setUint8(obfuscation_buffer_offset, 0xfe);
    ++obfuscation_buffer_offset;
    obfuscation_buffer_view.setUint8(obfuscation_buffer_offset, 0xff);
    ++obfuscation_buffer_offset;

    obfuscation_buffer_view.setUint16(obfuscation_buffer_offset, mt_get_random_num_secure(0xFFFF));
    obfuscation_buffer_offset += 2;

    for(var i = 0; i < 56; ++i)
    {
        out_buffer_view.setUint8(out_buffer_offset, obfuscation_buffer_view.getUint8(i));
        ++out_buffer_offset;
    }

    var obf_key_256 = new Uint8Array(obfuscation_buffer.slice(8, 40));
    var obf_vector_128 = new Uint8Array(obfuscation_buffer.slice(40, 56));

    var obfuscation_buffer_u8arr = new Uint8Array(obfuscation_buffer);
    
    aes_encryptors[url] = new aesjs.ModeOfOperation.ctr(obf_key_256, new aesjs.Counter(obf_vector_128));
    var encryptedBytes = aes_encryptors[url].encrypt(obfuscation_buffer_u8arr);

    for(var i = 56; i < 64; ++i)
    {
        out_buffer_view.setUint8(out_buffer_offset, encryptedBytes[i]);
        ++out_buffer_offset;
    }

    var obfuscation_buffer_reverse = obfuscation_buffer_u8arr.reverse();

    var deobf_key_256 = new Uint8Array(obfuscation_buffer_reverse.slice(8, 40));
    var deobf_vector_128 = new Uint8Array(obfuscation_buffer_reverse.slice(40, 56));
    
    aes_decryptors[url] = new aesjs.ModeOfOperation.ctr(deobf_key_256, new aesjs.Counter(deobf_vector_128));
}

function mt_inob_send_init(socket, url)
{
    var obf_buffer = new ArrayBuffer(64);
    var obf_buffer_view = new DataView(obf_buffer);

    mt_init_obfuscation(obf_buffer_view, url);
    socket.send(obf_buffer);

    obfuscation_init[url] = true;
}

export function mt_inob_send(socket, buffer, buffer_len, url)
{
    if(!obfuscation_init[url])
    {
        mt_inob_send_init(socket, url);
    }

    var out_buffer = new ArrayBuffer(buffer_len + 4);
    var out_buffer_view = new DataView(out_buffer);

    //console.log(buffer_len);
    mt_write_uint32(0, buffer_len, out_buffer_view);
    mt_write_bytes(4, buffer_len, new Uint8Array(buffer), out_buffer_view);

    var encrypted_buffer = aes_encryptors[url].encrypt(new Uint8Array(out_buffer));
    socket.send(encrypted_buffer);
}

export function mt_inob_recv(ev, url)
{
    if(!obfuscation_init[url])
    {
        return null;
    }

    var decrypted_buffer = (aes_decryptors[url].decrypt(new Uint8Array(ev.data))).buffer;
    return (decrypted_buffer.slice(4));
}