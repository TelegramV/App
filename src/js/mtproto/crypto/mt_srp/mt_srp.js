//MTProto Secure Remote Password W.I.P.
//Copyright 2019 Oleg Tsenilov
//https://github.com/OTsenilov

import {mt_write_uint32, mt_write_bytes} from "./../../network/mt_inob_codec"
import {BigInteger} from "../../vendor/jsbn/jsbn"
import * as sjcl from "./sjcl"

function H(data)
{
    return sjcl.hash.sha256.hash(data);
}

function H2(data)
{
    return sjcl.hash.sha256.hash(data);
}

function SH(data, salt)
{
    var c1 = sjcl.bitArray.concat(salt, data);
    var c2 = sjcl.bitArray.concat(c1, salt);
    return H(c2);
}

function PH1(password, salt1, salt2)
{
    return SH(SH(password, salt1), salt2);
}

var hmacSHA512 = function(key) {
    var hasher = new sjcl.misc.hmac(key, sjcl.hash.sha512);
    this.encrypt = function() {
      return hasher.encrypt.apply(hasher, arguments);
    };
  };
  var pbkdf2Sync_sha512 = function(password, salt, iterations, keylen) {
    var derivedKey = sjcl.misc.pbkdf2(password, salt, iterations, 512, hmacSHA512);
    return derivedKey;
  };

function PH2(password, salt1, salt2)
{
    var ph1 = PH1(password, salt1, salt2);
    var der_key = SH(pbkdf2Sync_sha512(ph1, salt1, 100000, 512), salt2);
    return der_key;
}

export default function mt_srp_check_password(g, p, salt1, salt2, srp_id, srp_B, password)
{
    console.log("started srp pass check");

    var g_padded_buffer = new ArrayBuffer(256);
    var g_padded_buffer_view = new DataView(g_padded_buffer);

    g_padded_buffer_view.setUint32(252, g, false);
    var g_padded = new Uint8Array(g_padded_buffer);

    var k_buffer = new ArrayBuffer(256 + 252 + 4);
    var k_buffer_view = new DataView(k_buffer);

    mt_write_bytes(0, 256, new Uint8Array(p), k_buffer_view);

    mt_write_bytes(256, 256, g_padded, k_buffer_view);

    var k_arr = new Uint8Array(k_buffer);
    var k_bits = sjcl.codec.bytes.toBits(k_arr);
    var k = H(k_bits);

    var x = PH2(sjcl.codec.utf8String.toBits(password), sjcl.codec.bytes.toBits(salt1), sjcl.codec.bytes.toBits(salt2));

    var p_bits = sjcl.codec.bytes.toBits(p);
    var big_g = new BigInteger(g.toString(), 10);
    var big_x = new BigInteger(sjcl.codec.hex.fromBits(x), 16);
    var big_p = new BigInteger(sjcl.codec.hex.fromBits(p_bits), 16);
    var v = big_g.modPow(big_x, big_p);

    var big_k = new BigInteger(sjcl.codec.hex.fromBits(k), 16);

    var k_v = (big_k.multiply(v)).mod(big_p);

    var a = sjcl.random.randomWords(64);

    var big_a = new BigInteger(sjcl.codec.hex.fromBits(a), 16);

    var g_a = big_g.modPow(big_a, big_p);

    var srp_B_bits = sjcl.codec.bytes.toBits(srp_B);
    var g_b = new BigInteger(sjcl.codec.hex.fromBits(srp_B_bits), 16);

    //WARNING TODO!!!!
    //man ssl -> BN_cmp() returns -1 if a < b, 0 if a == b and 1 if a > b. BN_ucmp() is the same using the absolute values of a and b.
    //so,  if t < zero then t = t + big_p
    var t = ((g_b.subtract(k_v)).mod(big_p));

    //u := H(g_a | g_b)
    var g_a_bits = sjcl.codec.hex.toBits(g_a.toString(16));
    var u = H(sjcl.bitArray.concat(g_a_bits, srp_B_bits));

    var big_u = new BigInteger(sjcl.codec.hex.fromBits(u), 16);
    var aux = big_a.add((big_u.multiply(big_x))); //TODO: RE-CHECK
    var s_a = t.modPow(aux, big_p);

    var k_a = H(sjcl.codec.hex.toBits(s_a.toString(16)));

    //M1 := H(  H(p) xor H(g) | H2(salt1) | H2(salt2) | g_a | g_b | k_a  )

    var g_padded_bits = sjcl.codec.bytes.toBits(g_padded);

    var H_p = new BigInteger(sjcl.codec.hex.fromBits(H(p_bits)), 16);
    var H_g = new BigInteger(sjcl.codec.hex.fromBits(H(g_padded_bits)), 16);

    var H_pg_xor_bits = sjcl.codec.hex.toBits((H_p.xor(H_g)).toString(16));
    var H2_salt1 = H(sjcl.codec.bytes.toBits(salt1));
    var H2_salt2 = H(sjcl.codec.bytes.toBits(salt2));

    var c1 = sjcl.bitArray.concat(H_pg_xor_bits, H2_salt1);
    var c2 = sjcl.bitArray.concat(c1, H2_salt2);
    var c3 = sjcl.bitArray.concat(c2, g_a_bits);
    var c4 = sjcl.bitArray.concat(c3, srp_B_bits)

    var M1 = H( sjcl.bitArray.concat(c4, k_a) );

    var M1_bytes = sjcl.codec.bytes.fromBits(M1);
    var g_a_bytes = sjcl.codec.bytes.fromBits(g_a_bits);

    return {
        srp_id: srp_id,
        A: new Uint8Array(g_a_bytes),
        M1: new Uint8Array(M1_bytes)
    };
}
