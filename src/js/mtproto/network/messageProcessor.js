import {createLogger} from "../../common/logger"
import {MTProto} from "../index";
import {longToBytes} from "../utils/bin";

const Logger = createLogger("MessageProcessor", {
    level: "warn",
    disableLog: true
})

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

        this.updateShortListeners = []

        this.handlers = {
            "msg_container": this.processMessageContainer.bind(this),
            "message": this.processMessage.bind(this),
            "rpc_result": this.processRpcResult.bind(this),
            "msgs_ack": this.processMessagesAck.bind(this),
            "bad_server_salt": this.processBadServerSalt.bind(this),
            "new_session_created": this.processNewSessionCreated.bind(this),
            "updateShort": this.processUpdateShort.bind(this),
            "updates": this.processUpdates.bind(this),
        }

    }

    processUpdateShort(message, messageID, sessionID) {
        this.updateShortListeners.forEach(listener => listener(message.update))
        // Logger.log("Short update", message)
    }

    processNewSessionCreated(message, messageID, sessionID) {

    }

    processUpdates(message, messageID, sessionID) {
        message.updates.forEach(update => {

        })
        // Logger.log("update", message)
    }

    listenUpdateShort(listener) {
        this.updateShortListeners.push(listener)
    }

    listenRpc(messageId, handler, reject) {
        this.rpcResultHandlers[messageId] = handler
        this.rpcErrorHandlers[messageId] = reject
    }

    process(message, messageID, sessionID) {

        if (this.handlers[message._]) {
            this.handlers[message._](message, messageID, sessionID)
        } else {
            Logger.warn('Unexpected message = ', message)
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
            Logger.error('Rpc error', error)

            this.rpcErrorHandlers[message.req_msg_id](error)

            delete this.rpcErrorHandlers[message.req_msg_id]
        } else {
            Logger.debug('Rpc response', message.result)

            this.rpcResultHandlers[message.req_msg_id](message.result)

            delete this.rpcResultHandlers[message.req_msg_id]
        }
    }
}
