import {createLogger} from "../../common/logger"
import {longToBytes} from "../utils/bin";
import MTProto from "../index"

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

        this.pongHandlers = {}
        this.rpcResultHandlers = {}
        this.rpcErrorHandlers = {}
        this.sentMessages = {}
        this.sentMessagesDebug = {}

        this.updateListeners = new Map()

        this.handlers = {
            "msg_container": this.processMessageContainer.bind(this),
            "message": this.processMessage.bind(this),
            "rpc_result": this.processRpcResult.bind(this),
            "pong": this.processPong.bind(this),
            "msgs_ack": this.processMessagesAck.bind(this),
            "bad_server_salt": this.processBadServerSalt.bind(this),
            "new_session_created": this.processNewSessionCreated.bind(this),

            // "updateShort": this.processUpdateShort.bind(this),
            // "updateShortMessage": this.processUpdateShortMessage.bind(this),
            // "updateNewMessage": this.processUpdateNewMessage.bind(this),
            // "updateNewChannelMessage": this.processUpdateNewChannelMessage.bind(this),
            // "updateShortChatMessage": this.processUpdateShortChatMessage.bind(this),
            // "updateShortSentMessage": this.processUpdateShortSentMessage.bind(this),
            // "updates": this.processUpdates.bind(this),
            // "updatesCombined": this.processUpdatesCombined.bind(this),
            // "updateReadChannelInbox": this.processUpdateReadChannelInbox.bind(this),
            // "updateReadChannelOutbox": this.processUpdateReadChannelOutbox.bind(this),
            // "updateReadHistoryInbox": this.processUpdateReadHistoryInbox.bind(this),
            // "updateReadHistoryOutbox": this.processUpdateReadHistoryOutbox.bind(this),
            // "updateDialogPinned": this.processUpdateDialogPinned.bind(this),
            // "updateDraftMessage": this.processUpdateDraftMessage.bind(this),
        }
    }

    listenUpdate(type, listener) {
        let listeners = this.updateListeners.get(type)
        if (!listeners) {
            listeners = this.updateListeners.set(type, []).get(type)
        }
        listeners.push(listener)
        console.log("listening", type, listeners)
    }

    processUpdate(type, update) {
        if (this.updateListeners.has(type)) {
            console.log("processing", type, update)
            this.updateListeners.get(type).forEach(l => {
                l(update)
            })
        } else {
            Logger.warn("unexpected update = ", type, update)
        }
    }

    processNewSessionCreated(message, messageID, sessionID) {

    }

    listenPong(messageId, handler) {
        this.pongHandlers[messageId] = handler
    }

    listenRpc(messageId, handler, reject) {
        this.rpcResultHandlers[messageId] = handler
        this.rpcErrorHandlers[messageId] = reject
    }

    process(message, messageID, sessionID) {

        if (this.handlers[message._]) {
            this.handlers[message._](message, messageID, sessionID)
        } else if (message._.startsWith("update")) {
            MTProto.UpdatesManager.process(message)
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
        this.networker.updateServerSalt(longToBytes(message.new_server_salt))
        this.networker.resendMessage(message.bad_msg_id)
    }

    processPong(message, messageID, sessionID) {
        const handler = this.pongHandlers[message.msg_id]
        if (handler) {
            handler(message)
        }
    }

    processRpcResult(message, messageID, sessionID) {
        this.networker.ackMessage(messageID)

        if (message.result._ === "rpc_error") {
            const error = this.networker.processError(message.result)
            Logger.error('Rpc error', error, ". request: ", this.sentMessagesDebug[message.req_msg_id])

            this.rpcErrorHandlers[message.req_msg_id](error)

            delete this.rpcErrorHandlers[message.req_msg_id]
        } else {
            Logger.debug('Rpc response', message.result)

            this.rpcResultHandlers[message.req_msg_id](message.result)

            delete this.rpcResultHandlers[message.req_msg_id]
        }
    }
}
