import random from "random-bigint"
import {bytesToHex} from "./bin"

export function bigAbsolute(a, b) {
    if (a > b) {
        return a - b
    }

    return b - a
}

export function bigGcd(a, b) {
    while (b) {
        const tmp = a
        a = b
        b = tmp % b
    }

    return a
}

export function bigMin(a, b) {
    if (a < b) {
        return a
    }

    return b
}

export function bytesToBigInt(bytes, le) {
    const calc = le ? bytes.reverse() : bytes
    const hex = bytesToHex(calc)
    return BigInt(`0x${hex}`)
}

/**
 *
 * @param {bigint} a
 * @param {bigint}b
 * @param {bigint} n
 * @returns {bigint}
 */
export function bigModPow(a, b, n) {
    a %= n;
    let result = BigInt(1)
    let x = a;

    while (b > 0) {
        const leastSignificantBit = b % BigInt(2)
        b /= BigInt(2)

        if (leastSignificantBit === BigInt(1)) {
            result *= x
            result %= n
        }

        x *= x
        x %= n
    }
    return result
}

export function bytesFromNativeBigInt(bigInt, le = false) {
    const result = []
    let value = BigInt(bigInt)

    while (value > BigInt(0)) {
        result.push(Number(value % BigInt(256)))
        value /= BigInt(256);
    }
    if (result.length === 0) {
        result.push(0)
    }
    return le ? result : result.reverse()
}

/**
 * native bigint factorization
 *
 * algorithm from: https://github.com/LonamiWebs/Telethon/blob/master/telethon/crypto/factorization.py
 * @param {bigint} pq
 * @returns {bigint[]}
 */
export function factorizeBigInt(pq) {
    const big0 = BigInt(0)
    const big1 = BigInt(1)
    const big2 = BigInt(2)

    if (pq % big2 === big0) {
        return [2, pq / big2]
    }

    let y = big1 + (random(64) % (pq - big1)),
        c = big1 + (random(64) % (pq - big1)),
        m = big1 + (random(64) % (pq - big1))

    let g = big1,
        r = big1,
        q = big1

    let x = big0,
        ys = big0

    while (g === big1) {
        x = y
        for (let i = big0; i < r; i += big1) {
            y = (((y ** big2) % pq) + c) % pq
        }

        let k = big0;
        while (k < r && g === big1) {
            ys = y
            for (let i = big0; i < bigMin(m, r - k); i += big1) {
                y = (((y ** big2) % pq) + c) % pq
                q = (q * bigAbsolute(x, y)) % pq
            }
            g = bigGcd(q, pq)
            k += m
        }

        r *= big2
    }

    if (g === pq) {
        while (true) {
            ys = (((ys ** big2) % pq) + c) % pq
            g = bigGcd(bigAbsolute(x, ys), pq)

            if (g > 1) {
                break
            }
        }
    }

    const p = g
    q = pq / p

    return (p < q) ? [p, q] : [q, p]
}
