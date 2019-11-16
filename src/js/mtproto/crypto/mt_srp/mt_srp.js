//MTProto Secure Remote Password W.I.P.
//Copyright 2019 Oleg Tsenilov
//https://github.com/OTsenilov

import {mt_write_uint32, mt_write_bytes} from "./../../network/mt_inob_codec"
import {BigInteger} from "jsbn"
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

    console.log("---------");
    console.log("PH1:");
    console.log(sjcl.codec.hex.fromBits(ph1));
    console.log("SALT1:");
    console.log(sjcl.codec.hex.fromBits(salt1));
    console.log("PBKDF RES:");
    console.log(sjcl.codec.bytes.fromBits(der_key));
    console.log("---------");
    return der_key;
    //return sjcl.codec.hex.fromBits(der_key);
}

//TODO move +
/*function bytearr_to_bitarr(bytes) {
    var out = [], i, tmp=0;
    for (i=0; i<bytes.length; i++) {
        tmp = tmp << 8 | bytes[i];
        if ((i&3) === 3) {
            out.push(tmp);
            tmp = 0;
        }
    }
    if (i&3) {
        out.push(sjcl.bitArray.partial(8*(i&3), tmp));
    }
    return out;
}*/

export default function mt_srp_check_password(g, p, salt1, salt2, srp_id, srp_B, password)
{
    /*console.log("___PBKDF TESTING...");
    var pbr = pbkdf2Sync_sha512("pass", "hi", 100000, 512);
    console.log(sjcl.codec.hex.fromBits(pbr));*/

    
    /*console.log("PBKDF TESTING2...");
    var pbr = sjcl.misc.pbkdf2("pass", "hi", 100000, 512, sjcl.misc.sha512);
    console.log(sjcl.codec.hex.fromBits(pbr));*/

    //bc8a2bb1e82e1f18671f56ca2633df5f8d173649fe584ae76a5b2484a052eaaef6608afe5df992ed29918ee8976c380b05488ddab2cdaba578f0f7d9766510c9
    //bc8a2bb1e82e1f18671f56ca2633df5f8d173649fe584ae76a5b2484a052eaaef6608afe5df992ed29918ee8976c380b05488ddab2cdaba578f0f7d9766510c9
    //96c47bb5135c26f1a6ac281cc0041ff1948752b94833ed053f3a078e06ed48f576dfedcc718eb70662d908f4d35dd9e6ead2cae258cf8b837c52a0984a50c185

    console.log("started srp pass check");

    var g_padded_buffer = new ArrayBuffer(256);
    var g_padded_buffer_view = new DataView(g_padded_buffer);
    //skipped sets to zero
    // / 252, g false ///try different byte orders
    //   0   g   true
    g_padded_buffer_view.setUint32(252, g, false);
    var g_padded = new Uint8Array(g_padded_buffer);
    console.log("g_padded bytes");
    console.log(g_padded);

    var k_buffer = new ArrayBuffer(256 + 252 + 4);
    var k_buffer_view = new DataView(k_buffer);

    //mt_write_uint32(0, g, k_buffer_view);
    mt_write_bytes(0, 256, new Uint8Array(p), k_buffer_view);

    mt_write_bytes(256, 256, g_padded, k_buffer_view);
    //k_buffer_view.setUint32(256 + 252, g, false); //try different byte orders

    /*
    for(var i = 0; i < 63; ++i)
    {
        k_buffer_view.setUint32(0, g, false);
    }
    k_buffer_view.setUint32(256 + 252, g, false); //try different byte orders
    */

    var k_arr = new Uint8Array(k_buffer);
    //console.log(k_arr);
    var k_bits = sjcl.codec.bytes.toBits(k_arr); //bytearr_to_bitarr(bytes);
    console.log(k_arr);
    console.log(sjcl.codec.bytes.fromBits(k_bits));
    var k = H(k_bits);

    //console.log(PH2("pass", sjcl.codec.hex.toBits("kek"), sjcl.codec.hex.toBits("kek2")));
    var x = PH2(sjcl.codec.utf8String.toBits(password), sjcl.codec.bytes.toBits(salt1), sjcl.codec.bytes.toBits(salt2));
    //console.log(sjcl.codec.bytes.fromBits(x));
    //v := pow(g, x) mod p
    //big_g.powermod(big_x, p) 

    /*
    var x = new BigInteger("2882343476", 10);
    var y = new BigInteger("48879", 10);

    var one = new BigInteger("1", 10);
    var z = x.modPow(one, y);
    
    console.log(z.toString(16));
    */
    /*console.log("----");
    console.log(g.toString());*/

    var p_bits = sjcl.codec.bytes.toBits(p);
    var big_g = new BigInteger(g.toString(), 10); //sjcl.bn.fromBits();
    console.log(big_g.toString(10));
    var big_x = new BigInteger(sjcl.codec.hex.fromBits(x), 16);
    var big_p = new BigInteger(sjcl.codec.hex.fromBits(p_bits), 16);
    var v = big_g.modPow(big_x, big_p); //g^x % p //normal

    //CTX???!!
    var big_k = new BigInteger(sjcl.codec.hex.fromBits(k), 16);
    
    var k_v = (big_k.multiply(v)).mod(big_p); //
    //var k_v = big_k.mulmod(v, big_p);

    var a = sjcl.random.randomWords(64); //256 bytes
    console.log("a bytes:");
    console.log(sjcl.codec.bytes.fromBits(a));

    var big_a = new BigInteger(sjcl.codec.hex.fromBits(a), 16);

    //var v = big_g.modPow(big_x, big_p);
    var g_a = big_g.modPow(big_a, big_p); //g^a % p
    console.log("___GA___");
    console.log(sjcl.codec.bytes.fromBits(sjcl.codec.hex.toBits(g_a.toString(16))));
    //___GOOD___
    //console.log("g_a bytes:");
    //console.log(g_a.toString(16));

    var srp_B_bits = sjcl.codec.bytes.toBits(srp_B);
    var g_b = new BigInteger(sjcl.codec.hex.fromBits(srp_B_bits), 16);

    //WARNING TODO!!!!
    //man ssl -> BN_cmp() returns -1 if a < b, 0 if a == b and 1 if a > b. BN_ucmp() is the same using the absolute values of a and b.
    //so,  if t < zero then t = t + big_p
    var t = ((g_b.subtract(k_v)).mod(big_p));
    console.log("T VALUE:");
    console.log(t.toString(10));

    //u := H(g_a | g_b)
    var g_a_bits = sjcl.codec.hex.toBits(g_a.toString(16));
    var u = H(sjcl.bitArray.concat(g_a_bits, srp_B_bits));

    var big_u = new BigInteger(sjcl.codec.hex.fromBits(u), 16);
    var aux = big_a.add((big_u.multiply(big_x))); //TODO: RE-CHECK
    var s_a = t.modPow(aux, big_p);
    //256 padding??? NOT NEEDED HERE
    console.log("S_A VALUE:");
    console.log(s_a.toString(16));
    console.log("S_A VALUE_HX:");
    console.log(sjcl.codec.bytes.fromBits(sjcl.codec.hex.toBits(s_a.toString(16))));

    var k_a = H(sjcl.codec.hex.toBits(s_a.toString(16)));

    //M1 := H(  H(p) xor H(g) | H2(salt1) | H2(salt2) | g_a | g_b | k_a  )

    //TODO g_padded +
    var g_padded_bits = sjcl.codec.bytes.toBits(g_padded);
    //var g_bits = sjcl.codec.hex.toBits(big_g.toString(16));

    var H_p = new BigInteger(sjcl.codec.hex.fromBits(H(p_bits)), 16);
    var H_g = new BigInteger(sjcl.codec.hex.fromBits(H(g_padded_bits)), 16);
    console.log("H_p:");
    console.log(H_p.toString(16));
    console.log("H_g:");
    console.log(H_g.toString(16));

    var H_pg_xor_bits = sjcl.codec.hex.toBits((H_p.xor(H_g)).toString(16)); //TODO: loop?
    var H2_salt1 = H(sjcl.codec.bytes.toBits(salt1));
    var H2_salt2 = H(sjcl.codec.bytes.toBits(salt2));

    //imagine this is a starwars battleship

    var c1 = sjcl.bitArray.concat(H_pg_xor_bits, H2_salt1);
    var c2 = sjcl.bitArray.concat(c1, H2_salt2);
    var c3 = sjcl.bitArray.concat(c2, g_a_bits);
    var c4 = sjcl.bitArray.concat(c3, srp_B_bits)

    var M1 = H( sjcl.bitArray.concat(c4, k_a) );
    
    //var srpA = group.g.powermod(x, group.N)
    var M1_bytes = sjcl.codec.bytes.fromBits(M1);
    var g_a_bytes = sjcl.codec.bytes.fromBits(g_a_bits);

    /*console.log("H_pg_xor bytes");
    console.log(sjcl.codec.bytes.fromBits(H_pg_xor_bits));

    console.log("c1 bytes");
    console.log(sjcl.codec.bytes.fromBits(c1));*/

    console.log("srp_id bytes:");
    console.log(typeof srp_id);
    console.log(srp_id);

    console.log("g_a bytes:");
    console.log(typeof g_a_bytes);
    console.log(g_a_bytes);

    console.log("M1 bytes:");
    console.log(typeof M1_bytes);
    console.log(M1_bytes);

    return {
        srp_id: srp_id,
        A: new Uint8Array(g_a_bytes),
        M1: new Uint8Array(M1_bytes)
    };
}