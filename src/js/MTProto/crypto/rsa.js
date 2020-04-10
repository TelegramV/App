import Bytes from "../utils/bytes"
import BigInteger from "big-integer"

export function RSA_ENCRYPT(publicKey, bytes: Uint8Array) {
    bytes = Bytes.addPadding(bytes, 255)

    const N = BigInteger(publicKey.modulus, 16)
    const E = BigInteger(publicKey.exponent, 16)
    const X = BigInteger.fromArray(Array.from(bytes), 256, false)

    const encryptedBigInteger = X.modPow(E, N)

    return new Uint8Array(encryptedBigInteger.toArray(256).value)
}