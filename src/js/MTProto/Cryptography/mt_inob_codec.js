// //MTProto Intermediate Obfuscated Codec W.I.P.
// //Copyright 2019 Oleg Tsenilov
// //https://github.com/OTsenilov
//
import isaac from '../../../../vendor/isaac'
export function mt_write_bytes(offset, length, input, buffer) {
    for (let i = 0; i < length; ++i) {
        buffer.setUint8(i + offset, input[i]);
    }
}

export function mt_write_uint32(offset, value, buffer) {
    buffer.setUint32(offset, value, true);
}

export function mt_get_random_num_secure(max) {
    //currently using ISAAC, not as secure as SJCL, but less size,
    //better compatibility and doesn't depend on mouse moves
    max = Math.floor(max);
    return Math.floor(isaac.random() * (max + 1));
}