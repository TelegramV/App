import {longToBytes} from "../utils/bin";
import MTProtoInternal from "../internal"

export class MessageProcessor {
    constructor(options) {
        if (!options.networker) {
            throw new Error("Where is the networker, baby?")
        }

        this.networker = options.networker

        this.pongHandlers = new Map()
        this.rpcResultHandlers = new Map()
        this.rpcErrorHandlers = new Map()
        this.sentMessages = new Map()
        this.sentMessagesDebug = new Map()

        this.handlers = {
            "msg_container": this.processMessageContainer.bind(this),
            "message": this.processMessage.bind(this),
            "rpc_result": this.processRpcResult.bind(this),
            "pong": this.processPong.bind(this),
            "msgs_ack": this.processMessagesAck.bind(this),
            "bad_server_salt": this.processBadServerSalt.bind(this),
            "new_session_created": this.processNewSessionCreated.bind(this),
            "msg_new_detailed_info": this.processMessageNewDetailedInfo.bind(this)
        }
    }

    processNewSessionCreated(message, messageID, sessionID) {
        MTProtoInternal.processUpdate({_: "new_session_created", message})
    }

    listenPong(messageId, handler) {
        this.pongHandlers.set(messageId, handler)
    }

    listenRpc(messageId, handler, reject) {
        this.rpcResultHandlers.set(messageId, handler)
        this.rpcErrorHandlers.set(messageId, reject)
    }

    process(message, messageID, sessionID) {
        try {
            if (!message._) {
                console.error("no type message", message)
                return
            }

            if (this.handlers[message._]) {
                this.handlers[message._](message, messageID, sessionID)
            } else {
                MTProtoInternal.processUpdate(message)
            }
        } catch (e) {
            console.error(e)
        }

    }

    processMessageContainer(message, messageID, sessionID) {
        for (let i = 0; i < message.messages.length; i++) {
            this.processMessage(message.messages[i], message.messages[i].msg_id, sessionID)
        }
    }

    processMessage(message, messageID, sessionID) {
        this.process(message.body, message.msg_id, sessionID)
    }

    processMessagesAck(message, messageID, sessionID) {
        for (let i = 0; i < message.msg_ids.length; i++) {
            this.networker.ackMessage(message.msg_ids[i])
        }
    }

    processBadServerSalt(message, messageID, sessionID) {
        this.networker.updateServerSalt(longToBytes(message.new_server_salt))
        this.networker.resendMessage(message.bad_msg_id)
    }

    processMessageNewDetailedInfo(message, messageID, sessionID) {
        // dunno what's this for but whatever
    }

    processPong(message, messageID, sessionID) {
        const handler = this.pongHandlers.get(message.msg_id)

        if (handler) {
            handler(message)
        }
    }

    processRpcResult(message, messageID, sessionID) {
        this.networker.ackMessage(messageID)

        if (message.result._ === "rpc_error") {
            const error = this.networker.processError(message.result)

            console.error("error = ", error, " request = ", this.sentMessagesDebug.get(message.req_msg_id))

            this.rpcErrorHandlers.get(message.req_msg_id)(error)

            // if (error.type && error.type.startsWith("FLOOD_WAIT_")) {
            //     const fwTime = parseInt(error.type.substring(error.type.length - 1))
            //
            //     console.warn("fw", fwTime)
            //     if (fwTime <= 5) {
            //         setTimeout(() => this.networker.resendMessage(message.req_msg_id), (fwTime * 1000) + 1000)
            //     } else {
            //         this.sentMessagesDebug.delete(message.req_msg_id)
            //         this.rpcErrorHandlers.delete(message.req_msg_id)
            //     }
            // } else {
            this.sentMessagesDebug.delete(message.req_msg_id)
            this.rpcErrorHandlers.delete(message.req_msg_id)
            // }
        } else {
            this.rpcResultHandlers.get(message.req_msg_id)(message.result)

            this.rpcResultHandlers.delete(message.req_msg_id)
        }
    }
}
