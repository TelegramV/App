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

// class BufferWriter extends DataView {
//     offset = 0
//
//     storeInt32(v) {
//         this.setInt32(this.offset, v)
//         this.offset += 4
//     }
//
//     storeBytes(v) {
//         for(let i = 0; i < v.length; i++) {
//             this.setUint8(this.offset, v[i])
//         }
//         this.offset += v.length
//     }
// }
// export class CallNetworker {
//     options = {
//         protocolVersion: 9,
//         minProtocolVersion: 3,
//         protocolName: 0x50567247, // "GrVP" in little endian (reversed here)
//     }
//
//     constructor(maxLayer: number) {
//         this.options.maxLayer = maxLayer
//     }
//
//     sendInit() {
//         const flags = 0
//
//         const arr = new Uint8Array(1024)
//         const dv = new BufferWriter(arr)
//
//         dv.storeInt32(this.options.protocolVersion)
//         dv.storeInt32(this.options.minProtocolVersion)
//         dv.storeInt32(flags)
//
//         dv.storeBytes([2, 1, 0, 0, 0])
//         // OPUS
//         dv.storeInt32(1398100047)
//         dv.storeBytes([0, 0])
//
//         return arr
//     }
//
//     writePacketHeader(bytes) {
//
//     }
// }