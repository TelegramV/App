import {BigInteger} from "jsbn"
import {addPadding, bytesFromBigInt} from "../utils/bin"

export function rsaEncrypt(publicKey, bytes) {
    bytes = addPadding(bytes, 255)

    // console.log('RSA encrypt start')
    const N = new BigInteger(publicKey.modulus, 16)
    const E = new BigInteger(publicKey.exponent, 16)
    const X = new BigInteger(bytes)
    const encryptedBigInt = X.modPowInt(E, N)
    const encryptedBytes = bytesFromBigInt(encryptedBigInt, 256)
    // console.log('RSA encrypt finish')

    return encryptedBytes
}