/**
 * (c) Telegram V
 */

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

//function good_A_first(A, p)
//{
//    var diff = p.subtract(A);
//}
//3af957d1fa37576aac7211c9f884a4095ff0ddf73b5580d4369ebbda83a5ccb2 / ok

export default function mt_srp_check_password(g, p, salt1, salt2, srp_id, srp_B, /*secure_random, */password)
{
    console.log("started srp pass check");
    console.log(password);
    //console.log("----- DURKA 1 -----");
    //console.log(p);

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
    console.log("PRIME_BYTES: ");
    console.log(p.length);
    //AL??
    console.log(sjcl.codec.hex.fromBits(p_bits));
    var big_g = new BigInteger(g.toString(), 10);
    var big_x = new BigInteger(sjcl.codec.hex.fromBits(x), 16);
    var big_p = new BigInteger(sjcl.codec.hex.fromBits(p_bits), 16);

    var srp_B_bits = sjcl.codec.bytes.toBits(srp_B);
    var g_b = new BigInteger(sjcl.codec.hex.fromBits(srp_B_bits), 16);
    console.log("srp_B checks...");
    console.log(g_b.toString(16));
    //sb > 0 and p - sb > 0
    if(g_b.compareTo(BigInteger.ONE) < 0)
    {
        console.log("g_b <= 0 FAULT!");
    }

    if((big_p.subtract(g_b)).compareTo(BigInteger.ONE) < 0)
    {
        console.log("g_b <= 0 FAULT!");
    }


    console.log("----- DURKA 1.5 -----");
    console.log(big_p.toByteArray());
    var v = big_g.modPow(big_x, big_p);

    var big_k = new BigInteger(sjcl.codec.hex.fromBits(k), 16);

    var k_v = (big_k.multiply(v)).mod(big_p);

    //var a_s = sjcl.codec.bytes.toBits(secure_random);
    var a = sjcl.random.randomWords(64);
    //TODO CHECK RANDOM

    var big_a = new BigInteger(sjcl.codec.hex.fromBits(a), 16);

    var g_a = big_g.modPow(big_a, big_p);
    console.log("--- g_a p DEBUG ---");
    console.log(g_a);
    console.log("----- DURKA 2 -----");
    console.log(big_p.length);
    console.log(new Uint8Array(big_p.toByteArray()));
    console.log("hard cmp:");
    //var durk = new BigInteger("c71caeb9c6b1c9048e6c522f70f13f73980d40238e3e21c14934d037563d930f48198a0aa7c14058229493d22530f4dbfa336f6e0ac925139543aed44cce7c3720fd51f69458705ac68cd4fe6b6b13abdc9746512969328454f18faf8c595f642477fe96bb2a941d5bcd1d4ac8cc49880708fa9b378e3c4f3a9060bee67cf9a4a4a695811051907e162753b56b0f6b410dba74d8a84b2a14b3144e0ef1284754fd17ed950d5965b4b9dd46582db1178d169c6bc465b0d6ff9ca3928fef5b9ae4e418fc15e83ebea0f87fa9ff5eed70050ded2849f47bf959d956850ce929851f0d8115f635b105ee2e4e15d04b2454bf6f4fadf034b10403119cd8e3b92fcc5b", 16);
    //console.log(durk.toByteArray());
    //console.log(durk.toString(16));
    console.log(sjcl.codec.hex.fromBits(sjcl.codec.bytes.toBits(big_p.toByteArray())));
    console.log("checking exp cf...");
    var dexp_1984 = new BigInteger("1751908409537131537220509645351687597690304110853111572994449976845956819751541616602568796259317428464425605223064365804210081422215355425149431390635151955247955156636234741221447435733643262808668929902091770092492911737768377135426590363166295684370498604708288556044687341394398676292971255828404734517580702346564613427770683056761383955397564338690628093211465848244049196353703022640400205739093118270803778352768276670202698397214556629204420309965547056893233608758387329699097930255380715679250799950923553703740673620901978370802540218870279314810722790539899334271514365444369275682816", 10);
    
    if(g_a.compareTo(BigInteger.ONE) <= 0)
    {
        console.log("g_a <= 0 FAULT!");
    }
    if(g_a.compareTo(big_p.subtract(BigInteger.ONE)) >= 0)
    {
        console.log("g_a >= big_p - 1 FAULT!");
    }
    if(g_a.compareTo(dexp_1984) < 0)
    {
        console.log("g_a < dexp_1984 FAULT!");
    }

    if(g_a.compareTo(big_p.subtract(dexp_1984)) >= 0)
    {
        console.log("g_a >= big_p - dexp_1984");
    }

    console.log("-------------------\n");

    //WARNING TODO!!!!
    //man ssl -> BN_cmp() returns -1 if a < b, 0 if a == b and 1 if a > b. BN_ucmp() is the same using the absolute values of a and b.
    //so,  if t < zero then t = t + big_p
    var t = ((g_b.subtract(k_v)).mod(big_p));
    if(t.compareTo(BigInteger.ZERO) < 0)
    {
        console.log("ZERO CHECK OP LESS");
        t = t.add(big_p);
    }
    else 
    {
        console.log("ZERO CHECK OP OK");
    }

    console.log("checking t/p...");
    console.log("----");
    console.log(t);
    console.log(t.toString(16));
    console.log("----");
    //var dexp_1984 = new BigInteger("1751908409537131537220509645351687597690304110853111572994449976845956819751541616602568796259317428464425605223064365804210081422215355425149431390635151955247955156636234741221447435733643262808668929902091770092492911737768377135426590363166295684370498604708288556044687341394398676292971255828404734517580702346564613427770683056761383955397564338690628093211465848244049196353703022640400205739093118270803778352768276670202698397214556629204420309965547056893233608758387329699097930255380715679250799950923553703740673620901978370802540218870279314810722790539899334271514365444369275682816", 10);
    
    if(t.compareTo(BigInteger.ONE) <= 0)
    {
        console.log("t <= 0 FAULT!");
    }
    if(t.compareTo(big_p.subtract(BigInteger.ONE)) >= 0)
    {
        console.log("t >= big_p - 1 FAULT!");
    }
    if(t.compareTo(dexp_1984) < 0)
    {
        console.log("t < dexp_1984 FAULT!");
    }

    if(t.compareTo(big_p.subtract(dexp_1984)) >= 0)
    {
        console.log("t >= big_p - dexp_1984");
    }

    console.log("-------------------\n");

    //u := H(g_a | g_b)
    
    console.log("DURKA 3");
    
    ///console.log(g_a.toString(16));
    ///console.log(g_a.toString(16).slice((257 - 256) * 2));
    
    console.log(g_a.toByteArray());
    console.log(g_a.toString(16));
    var g_a_bits = sjcl.codec.hex.toBits(g_a.toString(16));
    var u = H(sjcl.bitArray.concat(g_a_bits, srp_B_bits));

    var big_u = new BigInteger(sjcl.codec.hex.fromBits(u), 16);
    var aux = big_a.add((big_u.multiply(big_x))); //TODO: RE-CHECK
    var s_a = t.modPow(aux, big_p);

    console.log(s_a.toString(16));
    //console.log(s_a.toString(16).slice((257 - 256) * 2));
    var k_a = H(sjcl.codec.hex.toBits(s_a.toString(16)));

    //M1 := H(  H(p) xor H(g) | H2(salt1) | H2(salt2) | g_a | g_b | k_a  )

    var g_padded_bits = sjcl.codec.bytes.toBits(g_padded);

    var H_p = new BigInteger(sjcl.codec.hex.fromBits(H(p_bits)), 16);
    var H_g = new BigInteger(sjcl.codec.hex.fromBits(H(g_padded_bits)), 16);

    console.log((H_p.xor(H_g)).toString(16));
    //console.log((H_p.xor(H_g)).toString(16).slice((257 - 256) * 2));
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
