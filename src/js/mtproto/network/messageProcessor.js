import {longToBytes} from "../utils/bin";
import MTProto from "../index"

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
        }
    }

    processNewSessionCreated(message, messageID, sessionID) {

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
            if (this.handlers[message._]) {
                this.handlers[message._](message, messageID, sessionID)
            } else {
                MTProto.UpdatesManager.process(message)
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
            this.sentMessagesDebug.delete(message.req_msg_id)

            this.rpcErrorHandlers.get(message.req_msg_id)(error)

            this.rpcErrorHandlers.delete(message.req_msg_id)
        } else {
            this.rpcResultHandlers.get(message.req_msg_id)(message.result)

            this.rpcResultHandlers.delete(message.req_msg_id)
        }
    }
}
