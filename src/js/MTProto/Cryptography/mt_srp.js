/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import {mt_write_bytes} from "./mt_inob_codec"
import BigInteger from "big-integer"
import Uint8 from "../Utils/Uint8"
import sha256 from "./sha256"

async function H(data) {
    //console.log(new Uint8Array(await crypto.subtle.digest("SHA-256", data)), data)
    //console.log(new Uint8Array(sha256(data)), data)
    return new Uint8Array(await crypto.subtle.digest("SHA-256", data));
    //return new Uint8Array(sha256(data))
}

async function SH(data, salt) {
    return H(Uint8.concat(salt, data, salt));
}

async function PH1(password, salt1, salt2) {
    return SH(await SH(password, salt1), salt2);
}

async function pbkdf2_sha512(password, salt, iterations) {
  const importedKey = await crypto.subtle.importKey("raw", password, "PBKDF2", false, ["deriveBits"]);
  const params = {name: "PBKDF2", hash: "SHA-512", salt: salt, iterations: iterations};
  return new Uint8Array(await crypto.subtle.deriveBits(params, importedKey, 512));
}

async function PH2(password, salt1, salt2) {
    var ph1 = await PH1(password, salt1, salt2);
    return SH(await pbkdf2_sha512(ph1, salt1, 100000), salt2);
}

// https://core.telegram.org/api/srp
export default async function mt_srp_check_password(g, p, salt1, salt2, srp_id, srp_B, /*secure_random, */password) {
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
    var k_bits = Uint8.toBits(k_arr);
    var k = await H(k_bits);
    
    var x = await PH2(Uint8.fromString(password), Uint8.toBits(salt1), Uint8.toBits(salt2));

    var p_bits = Uint8.toBits(p);

    var big_g = BigInteger(g.toString(), 10);
    var big_x = BigInteger(Uint8.toHex(x), 16);
    var big_p = BigInteger(Uint8.toHex(p_bits), 16);

    var srp_B_bits = Uint8.toBits(srp_B);

    var g_b = BigInteger(Uint8.toHex(srp_B_bits), 16);

    if (g_b.compareTo(BigInteger.one) < 0) {
        console.log("g_b <= 0 FAULT!");
    }

    if ((big_p.subtract(g_b)).compareTo(BigInteger.one) < 0) {
        console.log("g_b <= 0 FAULT!");
    }

    var v = big_g.modPow(big_x, big_p);

    var big_k = BigInteger(Uint8.toHex(k), 16);

    var k_v = (big_k.multiply(v)).mod(big_p);

    //maybe use secure_random?
    let random = crypto.getRandomValues(new Int32Array(64));
    let a = Uint8.toBits(random);

    var big_a = BigInteger(Uint8.toHex(a), 16);

    var g_a = big_g.modPow(big_a, big_p);

    var dexp_1984 = BigInteger("1751908409537131537220509645351687597690304110853111572994449976845956819751541616602568796259317428464425605223064365804210081422215355425149431390635151955247955156636234741221447435733643262808668929902091770092492911737768377135426590363166295684370498604708288556044687341394398676292971255828404734517580702346564613427770683056761383955397564338690628093211465848244049196353703022640400205739093118270803778352768276670202698397214556629204420309965547056893233608758387329699097930255380715679250799950923553703740673620901978370802540218870279314810722790539899334271514365444369275682816", 10);

    if (g_a.compareTo(BigInteger.one) <= 0) {
        console.log("g_a <= 0 FAULT!");
    }
    if (g_a.compareTo(big_p.subtract(BigInteger.one)) >= 0) {
        console.log("g_a >= big_p - 1 FAULT!");
    }
    if (g_a.compareTo(dexp_1984) < 0) {
        console.log("g_a < dexp_1984 FAULT!");
    }

    if (g_a.compareTo(big_p.subtract(dexp_1984)) >= 0) {
        console.log("g_a >= big_p - dexp_1984");
    }

    //WARNING TODO!!!!
    //man ssl -> BN_cmp() returns -1 if a < b, 0 if a == b and 1 if a > b. BN_ucmp() is the same using the absolute values of a and b.
    //so,  if t < zero then t = t + big_p
    var t = ((g_b.subtract(k_v)).mod(big_p));
    if (t.compareTo(BigInteger.zero) < 0) {
        console.log("ZERO CHECK OP LESS");
        t = t.add(big_p);
    } else {
        console.log("ZERO CHECK OP OK");
    }

    if (t.compareTo(BigInteger.one) <= 0) {
        console.log("t <= 0 FAULT!");
    }
    if (t.compareTo(big_p.subtract(BigInteger.one)) >= 0) {
        console.log("t >= big_p - 1 FAULT!");
    }
    if (t.compareTo(dexp_1984) < 0) {
        console.log("t < dexp_1984 FAULT!");
    }

    if (t.compareTo(big_p.subtract(dexp_1984)) >= 0) {
        console.log("t >= big_p - dexp_1984");
    }

    var g_a_bits = Uint8.fromHex(g_a.toString(16));
    var u = await H(Uint8.concat(g_a_bits, srp_B_bits));

    var big_u = BigInteger(Uint8.toHex(u), 16);
    var aux = big_a.add((big_u.multiply(big_x))); //TODO: RE-CHECK
    var s_a = t.modPow(aux, big_p);

    var k_a = await H(Uint8.fromHex(s_a.toString(16)));

    //M1 := H(  H(p) xor H(g) | H2(salt1) | H2(salt2) | g_a | g_b | k_a  )

    var g_padded_bits = Uint8.toBits(g_padded);

    var H_p = BigInteger(Uint8.toHex(await H(p_bits)), 16);
    var H_g = BigInteger(Uint8.toHex(await H(g_padded_bits)), 16);

    var H_pg_xor_bits = Uint8.fromHex((H_p.xor(H_g)).toString(16));
    var H2_salt1 = await H(Uint8.toBits(salt1));
    var H2_salt2 = await H(Uint8.toBits(salt2));

    var c1 = Uint8.concat(H_pg_xor_bits, H2_salt1);
    var c2 = Uint8.concat(c1, H2_salt2);
    var c3 = Uint8.concat(c2, g_a_bits);
    var c4 = Uint8.concat(c3, srp_B_bits)

    var M1 = await H(Uint8.concat(c4, k_a));

    var M1_bytes = Uint8.fromBits(M1);
    var g_a_bytes = Uint8.fromBits(g_a_bits);

    return {
        srp_id: srp_id,
        A: new Uint8Array(g_a_bytes),
        M1: new Uint8Array(M1_bytes)
    };
}
