/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import BigInteger from "big-integer"
import Random from "../Utils/Random"
import Uint8 from "../Utils/Uint8"

export type P_Q = { p: Uint8Array; q: Uint8Array };

function min(a: BigInteger, b: BigInteger): BigInteger {
    if (a.compareTo(b) < 0) {
        return a;
    }

    return b;
}

function abs(a: BigInteger, b: BigInteger): BigInteger {
    if (a.compareTo(b) > 0) {
        return a.subtract(b);
    }

    return b.subtract(a);
}

function decompose_pq(pq: Uint8Array): P_Q {
    pq = Uint8.toBigInteger(pq);

    const big0 = BigInteger(0);
    const big1 = BigInteger(1);
    const big2 = BigInteger(2);

    if (pq.remainder(big2).equals(big0)) {
        return {
            p: Uint8.fromBigInteger(big2),
            q: Uint8.fromBigInteger(pq.divide(big2))
        };
    }

    let y = big1.add(BigInteger(Random.nextInteger(64)).mod(pq.subtract(big1))),
        c = big1.add(BigInteger(Random.nextInteger(64)).mod(pq.subtract(big1))),
        m = big1.add(BigInteger(Random.nextInteger(64)).mod(pq.subtract(big1)));

    let g = big1,
        r = big1,
        q = big1;

    let x = big0,
        ys = big0;

    while (g.equals(big1)) {
        x = y;

        for (let i = big0; i.compareTo(r) < 0; i = i.add(big1)) {
            y = y.pow(big2).mod(pq).add(c).remainder(pq);
        }

        let k = big0;

        while (k.compareTo(r) < 0 && g.equals(big1)) {
            ys = y;

            for (let i = big0; i < min(m, r.subtract(k)); i = i.add(big1)) {
                y = y.pow(big2).mod(pq).add(c).mod(pq);
                q = q.multiply(abs(x, y)).mod(pq);
            }

            g = BigInteger.gcd(q, pq);
            k = k.add(m);
        }

        r = r.multiply(big2);
    }

    if (g.equals(pq)) {
        while (true) {
            ys = ys.pow(big2).mod(pq).add(c).remainder(pq);
            g = abs(x, ys).gcd(pq);

            if (g.compareTo(big1) > 0) {
                break;
            }
        }
    }

    const p = g;
    q = pq.divide(p);

    return (p.compareTo(q) < 0) ? {
        p: Uint8.fromBigInteger(p),
        q: Uint8.fromBigInteger(q)
    } : {
        p: Uint8.fromBigInteger(q),
        q: Uint8.fromBigInteger(p)
    };
}

export default decompose_pq;