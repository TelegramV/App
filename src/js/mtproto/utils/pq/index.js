import {BigInteger} from "../../vendor/jsbn/jsbn"
import Bytes from "../bytes"
import Random from "../random"
import VBigInt from "../../bigint/VBigInt"

function bigint(num) {
    return new BigInteger(num.toString(16), 16)
}

/**
 * @param {VBigInt} a
 * @param {VBigInt} b
 * @return {VBigInt}
 */
const min = (a, b) => {
    if (a.lessThan(b)) {
        return a
    }

    return b
}

/**
 * @param {VBigInt} a
 * @param {VBigInt} b
 * @return {VBigInt}
 */
const abs = (a, b) => {
    if (a.greaterThan(b)) {
        return a.subtract(b)
    }

    return b.subtract(a)
}

/**
 * @param {*} pq
 */
function decompose(pq) {
    pq = VBigInt.create(pq)

    const big0 = VBigInt.create(0)
    const big1 = VBigInt.create(1)
    const big2 = VBigInt.create(2)

    if (pq.remainder(big2).equal(big0)) {
        return {
            p: big2.getBytes(4),
            q: pq.divide(big2).getBytes(4)
        }
    }

    let y = big1.add(VBigInt.create(Random.nextInteger(64)).remainder(pq.subtract(big1))),
        c = big1.add(VBigInt.create(Random.nextInteger(64)).remainder(pq.subtract(big1))),
        m = big1.add(VBigInt.create(Random.nextInteger(64)).remainder(pq.subtract(big1)))

    let g = big1,
        r = big1,
        q = big1

    let x = big0,
        ys = big0

    while (g.equal(big1)) {
        x = y

        for (let i = big0; i.lessThan(r); i = i.add(big1)) {
            y = y.pow(big2).remainder(pq).add(c).remainder(pq)
        }

        let k = big0

        while (k.lessThan(r) && g.equal(big1)) {
            ys = y
            for (let i = big0; i < min(m, r.subtract(k)); i = i.add(big1)) {
                y = y.pow(big2).remainder(pq).add(c).remainder(pq)
                q = q.multiply(abs(x, y)).remainder(pq)
            }
            g = q.gcd(pq)
            k = k.add(m)
        }

        r = r.multiply(big2)
    }

    if (g.equal(pq)) {
        while (true) {
            ys = ys.pow(big2).remainder(pq).add(c).remainder(pq)
            g = abs(x, ys).gcd(pq)

            if (g.greaterThan(big1)) {
                break
            }
        }
    }

    const p = g
    q = pq.divide(p)

    return (p.lessThan(q)) ? {
        p: p.getBytes(4),
        q: q.getBytes(4)
    } : {
        p: q.getBytes(4),
        q: p.getBytes(4)
    }
}

// function decompose(pq) {
//     const pqbn = new BigInteger(pq)
//     let it = 0
//     let g
//
//     for (let i = 0; i < 3; i++) {
//         let q = (Random.nextInteger(128) & 15) + 17
//         let x = bigint(Random.nextInteger((1000000000) + 1))
//         let y = x.clone()
//         let lim = 1 << (i + 18)
//
//         for (let j = 1; j < lim; j++) {
//             ++it
//             let a = x.clone()
//             let b = x.clone()
//             let c = bigint(q)
//
//             while (!b.equals(BigInteger.ZERO)) {
//                 if (!b.and(BigInteger.ONE).equals(BigInteger.ZERO)) {
//                     c = c.add(a)
//                     if (c.compareTo(pqbn) > 0) {
//                         c = c.subtract(pqbn)
//                     }
//                 }
//                 a = a.add(a)
//                 if (a.compareTo(pqbn) > 0) {
//                     a = a.subtract(pqbn)
//                 }
//                 b = b.shiftRight(1)
//             }
//
//             x = c.clone()
//             let z = x.compareTo(y) < 0 ? y.subtract(x) : x.subtract(y)
//             g = z.gcd(pqbn)
//             if (!g.equals(BigInteger.ONE)) {
//                 break
//             }
//             if ((j & (j - 1)) === 0) {
//                 y = x.clone()
//             }
//         }
//         if (g.compareTo(BigInteger.ONE) > 0) {
//             break
//         }
//     }
//
//     let f = pqbn.divide(g), P, Q
//
//     if (g.compareTo(f) > 0) {
//         P = f
//         Q = g
//     } else {
//         P = g
//         Q = f
//     }
//
//     return {
//         p: Bytes.fromBigInteger(P),
//         q: Bytes.fromBigInteger(Q)
//     }
// }

const PQ = {
    decompose: decompose
}

export default PQ
