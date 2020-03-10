import Bytes from "../utils/bytes"
import VBigInt from "../bigint/VBigInt"

export function RSA_ENCRYPT(publicKey, bytes: Uint8Array) {
    bytes = Bytes.addPadding(bytes, 255)

    const N = VBigInt.create(publicKey.modulus, 16)
    const E = VBigInt.create(publicKey.exponent, 16)
    const X = VBigInt.create(bytes)

    const encryptedBigInteger = X.modPow(E, N)

    return encryptedBigInteger.getBytes(256)
}