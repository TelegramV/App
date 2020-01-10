import {BigInteger} from "../../vendor/jsbn/jsbn"
import Bytes from "../bytes"
import Random from "../random"

function bigint(num) {
    return new BigInteger(num.toString(16), 16)
}

/**
 * TODO: rewrite the algorithm @ponyruletheworld
 *
 * @param {Array|ArrayBuffer|Uint8Array|Uint16Array|Uint32Array} pq
 */
function decompose(pq) {
    const pqbn = new BigInteger(pq)
    let it = 0
    let g

    for (let i = 0; i < 3; i++) {
        let q = (Random.nextInteger(128) & 15) + 17
        let x = bigint(Random.nextInteger((1000000000) + 1))
        let y = x.clone()
        let lim = 1 << (i + 18)

        for (let j = 1; j < lim; j++) {
            ++it
            let a = x.clone()
            let b = x.clone()
            let c = bigint(q)

            while (!b.equals(BigInteger.ZERO)) {
                if (!b.and(BigInteger.ONE).equals(BigInteger.ZERO)) {
                    c = c.add(a)
                    if (c.compareTo(pqbn) > 0) {
                        c = c.subtract(pqbn)
                    }
                }
                a = a.add(a)
                if (a.compareTo(pqbn) > 0) {
                    a = a.subtract(pqbn)
                }
                b = b.shiftRight(1)
            }

            x = c.clone()
            let z = x.compareTo(y) < 0 ? y.subtract(x) : x.subtract(y)
            g = z.gcd(pqbn)
            if (!g.equals(BigInteger.ONE)) {
                break
            }
            if ((j & (j - 1)) === 0) {
                y = x.clone()
            }
        }
        if (g.compareTo(BigInteger.ONE) > 0) {
            break
        }
    }

    let f = pqbn.divide(g), P, Q

    if (g.compareTo(f) > 0) {
        P = f
        Q = g
    } else {
        P = g
        Q = f
    }

    return {
        p: Bytes.fromBigInteger(P),
        q: Bytes.fromBigInteger(Q)
    }

}

const PQ = {
    decompose
}

export default PQ
