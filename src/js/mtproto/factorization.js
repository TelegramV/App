import {BigInteger} from "./vendor/jsbn/jsbn"
import {nextRandomInt} from "./utils/bin"

export function facttorizePq(pq) {
    pq = new BigInteger(pq)

    if (pq.mod(new BigInteger(2))) {
        return {
            p: 2,
            q: pq.divide(2)
        }
    }

    let y = new BigInteger(nextRandomInt(1, ))
}
