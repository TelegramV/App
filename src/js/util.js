//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

// Export utilities

// Import dependencies
import crypto from 'crypto'
import {BigInteger} from 'jsbn'
import sha1 from 'js-sha1'

import {getLocalTime} from "./time"

// Set the constants
var thousand = new BigInteger((1000).toString());
var lowerMultiplier = new BigInteger((4294964).toString());

// Create a message ID starting from the local time
export function createMessageId() {
    const logger = console;
    // Constants
    // Take the time and sum the time-offset with the server clock
    const time = new BigInteger(getLocalTime().toString());
    // Divide the time by 1000 `result[0]` and take the fractional part `result[1]`
    const result = time.divideAndRemainder(thousand);
    // Prepare lower 32 bit using the fractional part of the time
    const lower = result[1].multiply(lowerMultiplier);
    // Create the message id
    const messageId = result[0].shiftLeft(32).add(lower);

    logger.debug('MessageId(%s) was created with time = %s, lower = %s,  messageID binary = %s', messageId.toString(16), time, lower, messageId.toString(2));

    return '0x' + messageId.toString(16);
}

// Create SHA1 hash starting from a buffer or an array of buffers
export function createSHAHash(buffer, algorithm) {
    const logger = console;
    const sha1sum = sha1.create();
    if (Array.isArray(buffer)) {
        logger.debug('It\'s an Array of buffers');
        for (var i = 0; i < buffer.length; i++) {
            sha1sum.update(buffer[i]);
        }
    } else {
        logger.debug('It\'s only one buffer');
        sha1sum.update(buffer);
    }
    return sha1sum.digest();
}

// Create a random Buffer
export function createRandomBuffer(bytesLength) {
    return new Buffer(crypto.randomBytes(bytesLength));
}

// Create a new nonce
export function createNonce(bytesLength) {
    return createRandomBuffer(bytesLength);
}

// Mod Pow
export function modPow(x, e, m) {
    var logger = console;
    var bigX = (typeof x === 'number') ? new BigInteger(x + '', 10) : new BigInteger(x.toString('hex'), 16);
    var bigE = (typeof e === 'number') ? new BigInteger(e + '', 10) : new BigInteger(e.toString('hex'), 16);
    var bigM = (typeof m === 'number') ? new BigInteger(m + '', 10) : new BigInteger(m.toString('hex'), 16);
    var bigResult = bigX.modPow(bigE, bigM);

    logger.debug('X = %s, E = %s, M = %s, result = %s', bigX, bigE, bigM, bigResult);

    var result = new Buffer(bigResult.toByteArray());
    if (result.length > 256) {
        result = result.slice(result.length - 256);
    }
    return result;
}

// Xor op on buffers
export function xor(buffer1, buffer2) {
    var length = Math.min(buffer1.length, buffer2.length);
    var retBuffer = new Buffer(length);
    for (var i = 0; i < length; i++) {
        retBuffer[i] = buffer1[i] ^ buffer2[i];
    }
    return retBuffer;
}

// Convert a String to a Buffer using TL serialization
export function string2Buffer(str, bufferLength) {
    return stringValue2Buffer(str, bufferLength);
}

// Convert a Buffer to a String using TL deserialization
export function buffer2String(buffer) {
    return buffer2StringValue(buffer);
}

export function toPrintable(exclude, noColor) {
    var str = '{ ' + (this._typeName ? 'T:' + this._typeName.bold : '');
    if (typeof exclude !== 'object') {
        noColor = exclude;
        exclude = {};
    }
    for (var prop in this) {
        if ('_' !== prop.charAt(0) && exclude[prop] !== true) {
            var pair = value2String(prop, this[prop], exclude[prop], noColor);
            if (pair.value !== undefined) {
                str = str.slice(-1) === ' ' ? str : str + ', ';
                str += (noColor ? pair.prop : pair.prop.bold.cyan) + ': ' + pair.value;
            }
        }
    }
    str += ' }';
    return str;
}

export function value2String(prop, value, exclude, noColor) {
    switch (typeof value) {
        case 'boolean':
            break;
        case 'number':
            break;
        case 'function':
            value = undefined;
            break;
        case 'string':
            value = '"' + value + '"';
            break;
        default :
            if (util.isArray(value)) {
                var array = value;
                value = '';
                for (var i = 0; i < array.length; i++) {
                    value = value.length === 0 ? '[' : value + ', ';
                    value += value2String(null, array[i], null, noColor).value;
                }
                value += ']';
            } else if (value instanceof Buffer) {
                if (prop) {
                    prop += '[' + value.length + ']';
                }
                value = '0x' + value.toString('hex');
            } else if (typeof value === 'object' && typeof value.toPrintable === 'function') {
                value = value.toPrintable(exclude || {}, noColor);
            }
    }
    return {prop: prop, value: value};
}

// Convert a string value to buffer
export function stringValue2Buffer(stringValue, byteLength) {
    if ((stringValue).slice(0, 2) === '0x') {
        var input = stringValue.slice(2);
        var length = input.length;
        var buffers = [];
        var j = 0;
        for (var i = length; i > 0 && j < byteLength; i -= 2) {
            buffers.push(new Buffer(input.slice(i - 2, i), 'hex'));
            j++;
        }
        var buffer = Buffer.concat(buffers);
        var paddingLength = byteLength - buffer.length;
        if (paddingLength > 0) {
            var padding = new Buffer(paddingLength);
            padding.fill(0);
            buffer = Buffer.concat([buffer, padding]);
        }
        return buffer;
    } else {
        return bigInt2Buffer(new BigInteger(stringValue), byteLength);
    }
}

export function bigInt2Buffer(bigInt, byteLength) {
    var byteArray = bigInt.toByteArray();
    var bArrayLength = byteArray.length;
    var buffer = new Buffer(byteLength);
    buffer.fill(0);
    var length = Math.min(bArrayLength, byteLength);
    for (var i = 0; i < length; i++) {
        var value = byteArray[bArrayLength - 1 - i];
        buffer[i] = value;
    }
    return buffer;
}

// Convert a buffer value to string
export function buffer2StringValue(buffer) {
    var length = buffer.length;
    var output = '0x';
    for (var i = length; i > 0; i--) {
        output += buffer.slice(i - 1, i).toString('hex');
    }
    return output;
}

export function capitalize(str) {
    return (str.charAt(0).toUpperCase() + str.slice(1));
}

export function nextSha1() {

}