/** Gets a uint32 from string in big-endian order order */

function strToInt32(str: string, pos: number) {
    return (
      str.charCodeAt(pos) << 24
      ^ str.charCodeAt(pos + 1) << 16
      ^ str.charCodeAt(pos + 2) << 8
      ^ str.charCodeAt(pos + 3)
    );
  }
  
  /** Returns a uint32 as a string in big-endian order order */
  function int32ToStr(data: number) {
    return (
      String.fromCharCode((data >> 24) & 0xFF)
      + String.fromCharCode((data >> 16) & 0xFF)
      + String.fromCharCode((data >> 8) & 0xFF)
      + String.fromCharCode(data & 0xFF)
    );
  }
  
  // padding
  let _padding = String.fromCharCode(128);
  for (let i = 64; i--;) _padding += String.fromCharCode(0);
  
  /**
   * Updates a SHA-1 state with the given byte buffer.
   */
  function update(data: string) {
    let a; let b; let c; let d; let e;
    let i = 0; let f = 0; let t = 0;
  
    // Array to use to store words.
    const words = new Uint32Array(80);
  
    // SHA-256 state contains five 32-bit integers
    let h1 = 0x67452301;
    let h2 = 0xEFCDAB89;
    let h3 = 0x98BADCFE;
    let h4 = 0x10325476;
    let h5 = 0xC3D2E1F0;
  
    let len = data.length;
    let p = 0; // let ni = 64;
  
    // consume 512 bit (64 byte) chunks
    // While decrementing loop is much faster than for
    while (len >= 64) {
      // initialize hash value for this chunk
      a = h1;
      b = h2;
      c = h3;
      d = h4;
      e = h5;
  
      // round 1
      for (i = 0; i < 16; i += 1) {
        words[i] = strToInt32(data, p);
        p += 4; 
  
        f = d ^ (b & (c ^ d));
        t = ((a << 5) | (a >>> 27)) + f + e + 0x5A827999 + words[i];
        e = d;
        d = c;
        // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
        c = ((b << 30) | (b >>> 2)) >>> 0;
        b = a;
        a = t;
      }
  
      for (; i < 20; i += 1) {
        t = (words[i - 3] ^ words[i - 8] ^ words[i - 14] ^ words[i - 16]);
        t = (t << 1) | (t >>> 31);
        words[i] = t;
        f = d ^ (b & (c ^ d));
        t = ((a << 5) | (a >>> 27)) + f + e + 0x5A827999 + t;
        e = d;
        d = c;
        // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
        c = ((b << 30) | (b >>> 2)) >>> 0;
        b = a;
        a = t;
      }
  
      // round 2
      for (; i < 32; i += 1) {
        t = (words[i - 3] ^ words[i - 8] ^ words[i - 14] ^ words[i - 16]);
        t = (t << 1) | (t >>> 31);
        words[i] = t;
        f = b ^ c ^ d;
        t = ((a << 5) | (a >>> 27)) + f + e + 0x6ED9EBA1 + t;
        e = d;
        d = c;
        // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
        c = ((b << 30) | (b >>> 2)) >>> 0;
        b = a;
        a = t;
      }
  
      for (; i < 40; i += 1) {
        t = (words[i - 6] ^ words[i - 16] ^ words[i - 28] ^ words[i - 32]);
        t = (t << 2) | (t >>> 30);
        words[i] = t;
        f = b ^ c ^ d;
        t = ((a << 5) | (a >>> 27)) + f + e + 0x6ED9EBA1 + t;
        e = d;
        d = c;
        // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
        c = ((b << 30) | (b >>> 2)) >>> 0;
        b = a;
        a = t;
      }
  
      // round 3
      for (; i < 60; i += 1) {
        t = (words[i - 6] ^ words[i - 16] ^ words[i - 28] ^ words[i - 32]);
        t = (t << 2) | (t >>> 30);
        words[i] = t;
        f = (b & c) | (d & (b ^ c));
        t = ((a << 5) | (a >>> 27)) + f + e + 0x8F1BBCDC + t;
        e = d;
        d = c;
        // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
        c = ((b << 30) | (b >>> 2)) >>> 0;
        b = a;
        a = t;
      }
  
      // round 4
      for (; i < 80; i += 1) {
        t = (words[i - 6] ^ words[i - 16] ^ words[i - 28] ^ words[i - 32]);
        t = (t << 2) | (t >>> 30);
        words[i] = t;
        f = b ^ c ^ d;
        t = ((a << 5) | (a >>> 27)) + f + e + 0xCA62C1D6 + t;
        e = d;
        d = c;
        // `>>> 0` necessary to avoid iOS/Safari 10 optimization bug
        c = ((b << 30) | (b >>> 2)) >>> 0;
        b = a;
        a = t;
      }
  
      // update hash state
      h1 = (h1 + a) | 0;
      h2 = (h2 + b) | 0;
      h3 = (h3 + c) | 0;
      h4 = (h4 + d) | 0;
      h5 = (h5 + e) | 0;
  
      len -= 64;
    }
  
    return {
      h1, h2, h3, h4, h5,
    };
  }
  
  /**
   * Calculates sha1 hash from string
   */
  export default function sha1(message: string): string {
    // 56-bit length of message so far (does not including padding)
    const len = message.length;
    let len64hi = (len / 0x100000000) >>> 0;
    let len64lo = len >>> 0;
    const flen = [0, 0];
  
    for (let i = flen.length - 1; i >= 0; i -= 1) {
      flen[i] += len64lo;
      len64lo = len64hi + ((flen[i] / 0x100000000) >>> 0);
      flen[i] >>>= 0;
      len64hi = ((len64lo / 0x100000000) >>> 0);
    }
  
    let pad = message;
  
    // compute remaining size to be digested (include message length size)
    const remaining = flen[flen.length - 1] + 8;
  
    // add padding for overflow blockSize - overflow
    // _padding starts with 1 byte with first bit is set (byte value 128), then
    // there may be up to (blockSize - 1) other pad bytes
    const overflow = remaining & 63;
  
    pad += _padding.substr(0, 64 - overflow);
  
    // serialize message length in bits in big-endian order; since length
    // is stored in bytes we multiply by 8 and add carry from next int
    let next; let carry;
    let bits = flen[0] * 8;
  
    for (let i = 0; i < flen.length - 1; i += 1) {
      next = flen[i + 1] * 8;
      carry = (next / 0x100000000) >>> 0;
      bits += carry;
  
      pad += int32ToStr(bits >>> 0);
  
      bits = next >>> 0;
    }
  
    pad += int32ToStr(bits);
  
    const state = update(pad);
  
    return int32ToStr(state.h1)
      + int32ToStr(state.h2)
      + int32ToStr(state.h3)
      + int32ToStr(state.h4)
      + int32ToStr(state.h5);
  }
