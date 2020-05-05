//import * as sjcl from "../../../../../vendor/sjcl"
//import CryptoJS from "crypto-js";
//import Uint8 from "../../../MTProto/Utils/Uint8"
//import crypto_p from "../../../MTProto/Cryptography/mt_srp"
//import sjcl_p from "../../../MTProto/Cryptography/mt_srp- на випадок криворукості"


export default function CryptoTestPage() {
    
	let g = 3

	let p = new Uint8Array([199,28,174,185,198,177,201,4,142,108,82,47,112,241,63,115,152,13,64,35,142,62,33,193,73,52,208,55,86,61,147,15,72,25,138,10,167,193,64,88,34,148,147,210,37,48,244,219,250,51,111,110,10,201,37,19,149,67,174,212,76,206,124,55,32,253,81,246,148,88,112,90,198,140,212,254,107,107,19,171,220,151,70,81,41,105,50,132,84,241,143,175,140,89,95,100,36,119,254,150,187,42,148,29,91,205,29,74,200,204,73,136,7,8,250,155,55,142,60,79,58,144,96,190,230,124,249,164,164,166,149,129,16,81,144,126,22,39,83,181,107,15,107,65,13,186,116,216,168,75,42,20,179,20,78,14,241,40,71,84,253,23,237,149,13,89,101,180,185,221,70,88,45,177,23,141,22,156,107,196,101,176,214,255,156,163,146,143,239,91,154,228,228,24,252,21,232,62,190,160,248,127,169,255,94,237,112,5,13,237,40,73,244,123,249,89,217,86,133,12,233,41,133,31,13,129,21,246,53,177,5,238,46,78,21,208,75,36,84,191,111,79,173,240,52,177,4,3,17,156,216,227,185,47,204,91])

	let salt1 = new Uint8Array([13, 115, 121, 174, 255, 216, 69, 218, 220, 46, 97, 29, 36, 241, 216, 255, 119, 196, 13, 222, 58, 249, 126, 184, 181, 191, 152, 219, 222, 4, 161, 224, 246, 254, 233, 238, 192, 220, 102, 68])

	let salt2 = new Uint8Array([28, 225, 150, 107, 35, 176, 238, 96, 235, 73, 145, 72, 85, 42, 84, 117])

	let srp_id = "5536646955933844908"

	let src_B = new Uint8Array([106,2,116,78,73,51,170,131,228,27,35,208,54,255,213,244,132,86,162,82,250,49,44,32,105,85,58,123,222,223,70,41,5,6,198,54,93,101,30,156,134,5,145,89,170,60,214,131,18,10,165,66,187,15,253,45,117,29,172,235,207,122,131,94,222,214,163,55,77,75,14,34,90,37,232,214,173,42,239,221,68,138,14,114,225,251,88,171,245,94,233,171,9,105,227,231,10,10,135,204,79,72,144,107,135,243,21,87,61,154,69,226,188,121,83,201,169,40,246,156,154,21,49,72,242,222,41,194,108,230,32,251,243,95,17,145,252,118,250,157,179,204,126,38,164,99,54,247,143,221,107,33,107,89,113,161,45,53,43,195,195,230,181,158,250,71,110,166,214,6,142,182,80,199,244,63,54,200,111,56,74,59,48,240,39,153,241,218,164,84,77,45,178,157,110,0,166,98,156,38,252,142,1,156,16,209,25,151,90,29,19,18,24,244,116,27,86,14,57,150,80,132,211,5,237,1,39,154,208,188,138,230,213,124,199,13,250,92,226,236,34,178,40,48,146,75,209,75,26,38,168,68,128,240,149,132])

	let password = "12345678"

	/*console.log(sjcl_p(g, p, salt1, salt2, srp_id, src_B, password))
	crypto_p(g, p, salt1, salt2, srp_id, src_B, password).then(obj => {
		console.log("webcrypto:",obj)
	})*/


    //let bytes = [-954421575, -961427196, -1905503697, 1894858611, -1743962077, -1908530751, 1228197943, 1446875919, 1209633290, -1480507304, 580162514, 623965403, -97292434, 180954387, -1790726444, 1288600631, 553472502, -1806143398, -963848962, 1802179499, -594065839, 694760068, 1425117103, -1940299932, 611843734, -1154837475, 1540169034, -926135928, 118028955, 932068431, 982540478, -428017244, -1532586623, 273780862, 371676085, 1796172609, 230323416, -1471469036, -1290514930, -249018540, -48763499, 223962548, -1176680872, 766580621, 379349956, 1706088191, -1667001713, -279209244, -468124651, -398541152, -125851137, 1592619013, 233646153, -193201831, -648641268, -383154913, 226563574, 900793838, 776869328, 1260672191, 1867492848, 884016131, 295491811, -1188049829];

    /*let arr = [12135,-134135,135135,65474,-31434,-134135,354456,23415]

    let c = sjcl.codec.bytes.toBits(arr);
    let c2 = sjcl.codec.bytes.fromBits(c);
    console.log(arr, c, c2);

    let v = Uint8.toBits(arr);
    let v2 = Uint8.fromBits(v);
    console.log(arr, v, v2);*/

    /*let arr1 = [1234,123456,12342,1234];
    let arr2 = [56753,31341,-3435,-13415];

    let sjcl1 = sjcl.codec.bytes.toBits(arr1);
    let sjcl2 = sjcl.codec.bytes.toBits(arr2);
    let sjcl3 = sjcl.bitArray.concat(sjcl1, sjcl2);
    let k = sjcl.hash.sha256.hash(sjcl3);
    console.log(sjcl.codec.hex.fromBits(k));

    let c1 = Uint8.toBits(arr1);
    let c2 = Uint8.toBits(arr2);
    let c3 = Uint8.concat(c1,c2);
    crypto.subtle.digest("SHA-256", c3).then(hash =>{
    	var b = new Uint8Array(hash);
        var str = Array.prototype.map.call(b, x => ('00'+x.toString(16)).slice(-2)).join("")
        console.log("SubtleCrypto: "+str)
    })*/

    /*let sjcl_bytes = sjcl.codec.bytes.toBits(arr);
    let k = sjcl.hash.sha256.hash(sjcl_bytes);
    console.log(sjcl.codec.hex.fromBits(k));

    console.log(CryptoJS.SHA256(Bytes.toWords(arr)).toString());

    let d = Bytes.toEndianBits(arr);

    crypto.subtle.digest("SHA-256", d).then(hash =>{
    	var b = new Uint8Array(hash);
        var str = Array.prototype.map.call(b, x => ('00'+x.toString(16)).slice(-2)).join("")
        console.log("SubtleCrypto: "+str)
    })*/

    //let pass = [1,2,3,4,5,6,7,8];
    //let salt = [8,7,6,5,4,3,2,1];
    //let salt = CryptoJS.lib.WordArray.random(512 / 8).words;
    //let pass = "password";
    //let salt = "saltysal";

    /*let s, e;

    s=performance.now();
    let k = pbkdf2Sync_sha512(sjcl.codec.bytes.toBits(pass), sjcl.codec.bytes.toBits(salt), 100000);
    e=performance.now();
    console.log(sjcl.codec.hex.fromBits(k));
    console.log("sjcl took:" + (e-s)+"ms");

    s=performance.now();
    pbkdf2_sha512(Bytes.toEndianBits(pass), Bytes.toEndianBits(salt), 100000).then(val => {
    	e=performance.now();
    	var b = new Uint8Array(val);
        var str = Array.prototype.map.call(b, x => ('00'+x.toString(16)).slice(-2)).join("")
        console.log("SubtleCrypto: "+str)
        console.log("SubtleCrypto took:" + (e-s)+"ms");
    });*/

    /*let c_pass = Bytes.toWords(pass);
    let c_salt = Bytes.toWords(salt);

    let c = CryptoJS.PBKDF2(c_pass, c_salt, {
	  keySize: 512 / 32,
	  hasher: CryptoJS.algo.SHA512,
	  iterations: 1000
	});
	console.log(c.toString());*/


    // operations with bytes
    /*let by = [1,2,3,4,5,6,7,8];
    let tes = [9,10,11,12];

    let sjcl_by = sjcl.codec.bytes.toBits(by);
    let sjcl_tes = sjcl.codec.bytes.toBits(tes);
    let sjcl_bytes = sjcl.bitArray.concat(sjcl_by, sjcl_tes);
    let k = sjcl.hash.sha256.hash(sjcl_bytes);
    console.log(k);

    let crypto_by = Bytes.toWords(by);
    let crypto_tes = Bytes.toWords(tes);
    let crypto_bytes = crypto_by.concat(crypto_tes);
    let v = CryptoJS.SHA256(crypto_bytes).words;
    console.log(v);*/
    return (<div>Test in console...</div>)
}