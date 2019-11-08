//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

//     PqFinder class
//
// This class find the `PQ pair with P < Q` starting from a `BigInteger` value

/*jshint bitwise:false*/

// Import dependencies
import BigInteger from "bigint-node"

// The constructor may be called either giving a `Buffer` with the binary image or
// a `String / Number` representation of the `BigInteger` number
export class PqFinder {
    constructor(pqNumber) {
        this._pqNumber = ('number' === typeof pqNumber) ? createBigIntFromNumber(pqNumber) :
            ('string' === typeof pqNumber) ? createBigIntFromString(pqNumber) : createBigIntFromBuffer(pqNumber);
    }


// Get the original PQ pair number.
    getPQPairNumber() {
        return this._pqNumber;
    };

// The method calculates the pair P and Q with p < q and returns an array where `p = [0] and q = [1]`
    findPQ() {
        if (!this._pq) {
            let num = this._pqNumber;
            let prime;
            for (let i = 0; i < 3; i++) {
                let q = createBigIntFromNumber((nextRandom(128) & 15) + 17);
                let x = createBigIntFromNumber(nextRandom(1000000000) + 1);
                let y = x.duplicate();
                let lim = 1 << (i + 18);
                for (let j = 1; j < lim; j++) {
                    let a = x.duplicate();
                    let b = x.duplicate();
                    let c = q.duplicate();
                    while (!b.eql(BigInteger.Zero())) {
                        if (b.repr[0] & 1) {
                            c.addEquals(a);
                            if (c.gt(num)) {
                                c = c.subtract(num);
                            }
                        }
                        a.addEquals(a);
                        if (a.gt(num)) {
                            a = a.subtract(num);
                        }
                        b = b.shiftRight(1);
                    }
                    x = c.duplicate();
                    let z = y.gt(x) ? y.subtract(x) : x.subtract(y);
                    prime = z.gcd(num, a, b);
                    if (!prime.eql(BigInteger.One())) {
                        break;
                    }
                    if ((j & (j - 1)) === 0) {
                        y = x.duplicate();
                    }
                }
                if (prime.gt(BigInteger.One())) {
                    break;
                }
            }
            let cofactor = num.divide(prime)[0];
            this._pq = cofactor.gt(prime) ? [prime, cofactor] : [cofactor, prime];
        }
        return this._pq;
    };


    // the method returns a new Buffer for each P and Q value as array
    getPQAsBuffer() {
        return [new Buffer(this.findPQ()[0].toRawBytes()), new Buffer(this.findPQ()[1].toRawBytes())];
    };
}

function createBigIntFromNumber(num) {
    return new BigInteger.FromNumber(num);
}

function createBigIntFromString(num) {
    return new BigInteger.ParseFromString(num, 10);
}

function createBigIntFromBuffer(num) {
    return new BigInteger.FromRawBytes(num);
}

function nextRandom(max) {
    return Math.floor(Math.random() * max);
}