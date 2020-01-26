import Bytes from "../utils/bytes"
import VBigInt from "../bigint/VBigInt"

export function rsaEncrypt(publicKey, bytes) {
    bytes = Bytes.addPadding(bytes, 255)

    const N = VBigInt.create(publicKey.modulus, 16)
    const E = VBigInt.create(publicKey.exponent, 16)
    const X = VBigInt.create(bytes)

    const encryptedBigInteger = X.modPow(E, N)

    return encryptedBigInteger.getBytes(256)
}

/*
export function rsaEncrypt(publicKey, bytes) {
    bytes = Bytes.addPadding(bytes, 255)

    const N = new BigInteger(publicKey.modulus, 16)
    const E = new BigInteger(publicKey.exponent, 16)
    const X = new BigInteger(bytes)
    const encryptedBigInteger = X.modPow(E, N)

    return Bytes.fromBigInteger(encryptedBigInteger, 256)

}
*/