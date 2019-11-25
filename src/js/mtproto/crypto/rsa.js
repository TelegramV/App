import {BigInteger} from "../vendor/jsbn/jsbn"
import Bytes from "../utils/bytes"

export function rsaEncrypt(publicKey, bytes) {
    bytes = Bytes.addPadding(bytes, 255)

    const N = new BigInteger(publicKey.modulus, 16)
    const E = new BigInteger(publicKey.exponent, 16)
    const X = new BigInteger(bytes)
    const encryptedBigInteger = X.modPow(E, N)

    return Bytes.fromBigInteger(encryptedBigInteger, 256)
}
