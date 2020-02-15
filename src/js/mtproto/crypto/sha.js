import Rusha from "rusha"
import CryptoJS from "../vendor/crypto"
import Bytes from "../utils/bytes"
//import sha1 from "./sha1_n"

export const RushaSingleton = new Rusha(1024 * 1024);

/*export function toHexString(byteArray) {
    return Array.prototype.map.call(byteArray, function(byte) {
      return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}
export function hex(str: string): string {
    const normalized = str.length % 2 === 1 ? `0${str}` : str;
    const buf = [];
  
    for (let i = 0; i < normalized.length; i += 2) {
      buf.push(+`0x${normalized.slice(i, i + 2)}`);
    }
  
    return String.fromCharCode.apply(null, buf);
}
export function ascii_to_hexa(str) {
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++) 
     {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	 }
	return arr1.join('');
}
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}
export function toByteArray(hexString) {
    var result = [];
    for (var i = 0; i < hexString.length; i += 2) {
      result.push(parseInt(hexString.substr(i, 2), 16));
    }
    return result;
}*/

/**
 * @param bytes
 * @return {ArrayBufferLike}
 * @constructor
 */
export function SHA1_ArrayBuffer(bytes) {
    const rushaInstance = RushaSingleton || new Rusha(1024 * 1024)

    //console.log("s-test: " + toHexString(bytes));
    //console.log("sha out: " + ascii_to_hexa(sha1(toHexString(bytes))));
    //return /*toByteArray(*/ascii_to_hexa(sha1(toHexString(bytes)));//);
    //return toByteArray(ascii_to_hexa(sha1(ab2str(bytes))));
    return rushaInstance.rawDigest(bytes).buffer
}

/**
 * @param bytes
 * @return {Array}
 * @constructor
 */
export function SHA1(bytes) {
    //return Bytes.fromHex(SHA1_ArrayBuffer(bytes));
    return Bytes.fromArrayBuffer(SHA1_ArrayBuffer(bytes))
}

/**
 * @param bytes
 * @return {Uint8Array}
 * @constructor
 */
export function SHA256(bytes) {
    const hashWords = CryptoJS.SHA256(Bytes.toWords(bytes))

    return Bytes.fromWords(hashWords)
}