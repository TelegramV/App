// import CallNetworker from "./CallNetworker";
// import {BufferReader, BufferWriter} from "../../Utils/buffer";
// import AppConfiguration from "../../Config/AppConfiguration";
// import {CallsManager} from "./CallManager";
//
// export default class CallMessageHandler {
//     constructor(networker: CallNetworker) {
//         this.networker = networker
//         this.packetHandlers = {
//             1: this.handleInit,
//             2: this.handleInitAck,
//             // 3: this.handleStreamState,
//             4: this.handleStreamData,
//             // 5: this.handleUpdateStreams,
//             6: this.handlePing,
//             7: this.handlePong,
//             14: this.handleNop,
//         }
//     }
//
//     handleNop = (buf: BufferReader, pseq: number) => {
//         // NOP
//     }
//
//     handleInit = (buf: BufferReader, pseq: number) => {
//         console.log("got Init!")
//         this.sendInitAck()
//
//     }
//
//     handleInitAck = (buf: BufferReader, pseq: number) => {
//         const peerVersion = buf.getUint()
//         const minPeerVersion = buf.getUint()
//         const streamCount = buf.getByte()
//         console.log("PKT_INIT_ACK", {peerVersion, minPeerVersion, streamCount})
//
//         for(let i = 0; i < streamCount; i++) {
//             const streamId = buf.getByte()
//             const type = buf.getByte()
//             const codec = buf.getUint()
//             const frameDuration = buf.getShort()
//             const enabled = buf.getByte() === 1
//             console.log(`stream #${i}`, {streamId, type, codec, frameDuration, enabled})
//         }
//
//         this.sendInitAck()
//     }
//
//     handleStreamData = (buf: BufferReader, pseq: number) => {
//         let streamId = buf.getByte()
//         const flags = streamId & 0xC0;
//         streamId &= 0x3F;
//         let sdlen = (flags & 0x40 ? buf.getUshort() : buf.getByte())
//         const pts = buf.getUint()
//         const fragmented = sdlen & (1 << 14)
//         const extraFEC = sdlen & (1 << 13)
//         const keyframe = sdlen & (1 << 15)
//         if(fragmented) {
//             let fragmentedIndex = buf.getByte()
//             let fragmentedCount = buf.getByte()
//         }
//         sdlen &= 0x7FF
//         const actualData = buf.getBytes(sdlen)
//         CallsManager.decodeOpus(actualData)
//         // handle input
//         // try {
//         //     this.decoder.decode(actualData)
//         // } catch(ex) {
//         //     console.error(ex)
//         // }
//
//         // TODO handle FEC properly
//         if(extraFEC) {
//             const fecCount = buf.getByte()
//             for(let i = 0; i < fecCount; i++) {
//                 const dlen = buf.getByte()
//                 const bytes = buf.getBytes(dlen)
//                 // handle input
//             }
//         }
//         // console.log(actualData)
//     }
//
//     handlePing = (buf: BufferReader, pseq: number) => {
//         this.sendPong(pseq)
//         console.log("got ping!")
//     }
//
//     handlePong = (buf: BufferReader, pseq: number) => {
//         console.log("got pong!")
//     }
//
//     sendPong(pseq) {
//         const buf = new BufferWriter()
//         buf.storeInt(pseq)
//
//         this.networker.sendPacket(7, buf.getBytes())
//     }
//
//
//     sendInitAck() {
//         console.log("send init ACK")
//
//         const buf = new BufferWriter()
//         buf.storeInt(AppConfiguration.calls.protocolVersion)
//         buf.storeInt(AppConfiguration.calls.minProtocolVersion)
//
//         buf.storeByte(1)
//         buf.storeByte(1)
//         buf.storeByte(1)
//         buf.storeInt(1330664787)
//         buf.storeShort(60)
//         buf.storeByte(1)
//
//         this.networker.sendPacket(2, buf.getBytes())
//     }
// }