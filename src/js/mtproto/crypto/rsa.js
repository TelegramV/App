import {addPadding} from "../utils/bin"
import {bigModPow, bytesFromNativeBigInt, bytesToBigInt} from "../utils/nativeBigInt"

export function rsaEncrypt(publicKey, bytes) {
    bytes = addPadding(bytes, 255)

    const X = bytesToBigInt(bytes)
    const E = BigInt(`0x${publicKey.exponent}`)
    const N = BigInt(`0x${publicKey.modulus}`)

    const encryptedBigInt = bigModPow(X, E, N)

    return bytesFromNativeBigInt(encryptedBigInt)
}
