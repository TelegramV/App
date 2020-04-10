import Random from "../random"
import Bytes from "../bytes"
import BigInteger from "big-integer"

/**
 * @param {BigInteger} a
 * @param {BigInteger} b
 * @return {BigInteger}
 */
const min = (a, b) => {
    if (a.compareTo(b) < 0) {
        return a
    }

    return b
}

/**
 * @param {BigInteger} a
 * @param {BigInteger} b
 * @return {BigInteger}
 */
const abs = (a, b) => {
    if (a.compareTo(b) > 0) {
        return a.subtract(b)
    }

    return b.subtract(a)
}

/**
 * @param {Uint8Array | BigInteger} pq
 */
function decompose(pq) {
    pq = Bytes.toBigInteger(pq)

    const big0 = BigInteger(0)
    const big1 = BigInteger(1)
    const big2 = BigInteger(2)

    if (pq.remainder(big2).equals(big0)) {
        return {
            p: Bytes.fromBigInteger(big2),
            q: Bytes.fromBigInteger(pq.divide(big2))
        }
    }

    let y = big1.add(BigInteger(Random.nextInteger(64)).mod(pq.subtract(big1))),
        c = big1.add(BigInteger(Random.nextInteger(64)).mod(pq.subtract(big1))),
        m = big1.add(BigInteger(Random.nextInteger(64)).mod(pq.subtract(big1)))

    let g = big1,
        r = big1,
        q = big1

    let x = big0,
        ys = big0

    while (g.equals(big1)) {
        x = y

        for (let i = big0; i.compareTo(r) < 0; i = i.add(big1)) {
            y = y.pow(big2).mod(pq).add(c).remainder(pq)
        }

        let k = big0

        while (k.compareTo(r) < 0 && g.equals(big1)) {
            ys = y
            for (let i = big0; i < min(m, r.subtract(k)); i = i.add(big1)) {
                y = y.pow(big2).mod(pq).add(c).mod(pq)
                q = q.multiply(abs(x, y)).mod(pq)
            }
            g = BigInteger.gcd(q, pq)
            k = k.add(m)
        }

        r = r.multiply(big2)
    }

    if (g.equals(pq)) {
        while (true) {
            ys = ys.pow(big2).mod(pq).add(c).remainder(pq)
            g = abs(x, ys).gcd(pq)

            if (g.compareTo(big1) > 0) {
                break
            }
        }
    }

    const p = g
    q = pq.divide(p)

    return (p.compareTo(q) < 0) ? {
        p: Bytes.fromBigInteger(p),
        q: Bytes.fromBigInteger(q)
    } : {
        p: Bytes.fromBigInteger(q),
        q: Bytes.fromBigInteger(p)
    }
}

const PQ = {
    decompose: decompose
}

export default PQ
