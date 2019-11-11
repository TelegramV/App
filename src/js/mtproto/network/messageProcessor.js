import {createLogger} from "../../common/logger"
import {MTProto} from "../index";
import {longToBytes} from "../utils/bin";

/**
 * TODO: We should rewrite this shit!
 */
export class MessageProcessor {
    constructor(options) {
        if (!options.networker) {
            throw new Error("Where is the networker, baby?")
        }

        this.networker = options.networker

        this.rpcResultHandlers = {}
        this.rpcErrorHandlers = {}
        this.sentMessages = {}

        this.logger = createLogger("MessageProcessor")

        // do not ask me why have I wrapped this functions into another functions! Never!
        this.handlers = {
            "msg_container": (message, messageID, sessionID) => this.processMessageContainer(message, messageID, sessionID),
            "message": (message, messageID, sessionID) => this.processMessage(message, messageID, sessionID),
            "rpc_result": (message, messageID, sessionID) => this.processRpcResult(message, messageID, sessionID),
            "msgs_ack": (message, messageID, sessionID) => this.processMessagesAck(message, messageID, sessionID),
            "bad_server_salt": (message, messageID, sessionID) => this.processBadServerSalt(message, messageID, sessionID)
        }

    }

    listenRpc(messageId, handler, reject) {
        this.rpcResultHandlers[messageId] = handler
        this.rpcErrorHandlers[messageId] = reject
    }

    process(message, messageID, sessionID) {

        if (this.handlers[message._]) {
            this.handlers[message._](message, messageID, sessionID)
        } else {
            this.logger.warn('Unexpected message = ', message)
        }

    }

    processMessageContainer(message, messageID, sessionID) {
        for (let i = 0; i < message.messages.length; i++) {
            this.processMessage(message.messages[i], message.messages[i].msg_id, sessionID)
        }
    }

    processMessage(message, messageID, sessionID) {
        //this.logger.debug("Received message", message)

        this.process(message.body, message.msg_id, sessionID)
    }

    processMessagesAck(message, messageID, sessionID) {
        for (let i = 0; i < message.msg_ids.length; i++) {
            this.networker.ackMessage(message.msg_ids[i])
        }
    }

    processBadServerSalt(message, messageID, sessionID) {
        MTProto.updateServerSalt(longToBytes(message.new_server_salt))
        this.networker.resendMessage(message.bad_msg_id)
    }

    processRpcResult(message, messageID, sessionID) {
        this.networker.ackMessage(messageID)

        if (message.result._ === "rpc_error") {
            const error = this.networker.processError(message.result)
            this.logger.error('Rpc error', error)

            this.rpcErrorHandlers[message.req_msg_id](error)

            delete this.rpcErrorHandlers[message.req_msg_id]
        } else {
            this.logger.debug('Rpc response', message.result)

            this.rpcResultHandlers[message.req_msg_id](message.result)

            delete this.rpcResultHandlers[message.req_msg_id]
        }
    }
}