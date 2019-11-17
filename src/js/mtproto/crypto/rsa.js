import {addPadding, bytesFromBigInt, bytesToHex} from "../utils/bin"
import {BigInteger} from "./../vendor/jsbn/jsbn"

export function rsaEncrypt(publicKey, bytes) {
    bytes = addPadding(bytes, 255)

    const N = new BigInteger(publicKey.modulus, 16)
    const E = new BigInteger(publicKey.exponent, 16)
    const X = new BigInteger(bytes)
    const encryptedBigInt = X.modPow(E, N)

    return bytesFromBigInt(encryptedBigInt, 256)
}