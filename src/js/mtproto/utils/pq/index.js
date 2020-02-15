import Random from "../random"
import VBigInt from "../../bigint/VBigInt"

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

const PQ = {
    decompose: decompose
}

export default PQ
