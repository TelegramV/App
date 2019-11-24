import {createLogger} from "../../common/logger"
import {MTProto} from "../index";
import {longToBytes} from "../utils/bin";
import PeersManager from "../../api/peers/peersManager"

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

        this.updateShortListeners = []
        this.updateShortMessagesListeners = []
        this.updateNewMessagesListeners = []
        this.updateNewChannelMessagesListeners = []
        this.updateReadHistoryInboxListeners = []
        this.updateReadHistoryOutboxListeners = []
        this.updateEditChannelMessageListeners = []
        this.updateDraftMessageListeners = []
        this.updateDialogUnreadMarkListeners = []

        this.handlers = {
            "msg_container": this.processMessageContainer.bind(this),
            "message": this.processMessage.bind(this),
            "rpc_result": this.processRpcResult.bind(this),
            "pong": this.processPong.bind(this),
            "msgs_ack": this.processMessagesAck.bind(this),
            "bad_server_salt": this.processBadServerSalt.bind(this),
            "new_session_created": this.processNewSessionCreated.bind(this),
            "updateShort": this.processUpdateShort.bind(this),
            "updateShortMessage": this.processUpdateShortMessage.bind(this),
            "updateNewMessage": this.processUpdateNewMessage.bind(this),
            "updateNewChannelMessage": this.processUpdateNewChannelMessage.bind(this),
            "updates": this.processUpdates.bind(this),
            "updateReadHistoryOutbox": this.processUpdateReadHistoryOutbox.bind(this),
            "updateReadHistoryInbox": this.processUpdateReadHistoryInbox.bind(this),
            "updateEditChannelMessage": this.processUpdateEditChannelMessage.bind(this),
            "updateDraftMessage": this.processUpdateDraftMessage.bind(this),
            "updateDialogUnreadMark": this.processUpdateDialogUnreadMark.bind(this)
        }
    }

    processUpdateShort(message, messageID, sessionID) {
        //console.log(message)
        this.updateShortListeners.forEach(listener => listener(message.update))
        // Logger.log("Short update", message)
    }

    processUpdateEditChannelMessage(message, messageID, sessionID) {
        this.updateEditChannelMessageListeners.forEach(listener => listener(message))
    }

    processUpdateDialogUnreadMark(message, messageID, sessionID) {
        this.updateDialogUnreadMarkListeners.forEach(listener => listener(message))
    }

    processUpdateDraftMessage(message, messageID, sessionID) {
        this.updateDraftMessageListeners.forEach(listener => listener(message))
    }

    processUpdateReadHistoryInbox(message, messageID, sessionID) {
        //console.log(message)
        this.updateReadHistoryInboxListeners.forEach(listener => listener(message))
        // Logger.log("Short update", message)
    }

    processUpdateReadHistoryOutbox(message, messageID, sessionID) {
        //console.log(message)
        this.updateReadHistoryOutboxListeners.forEach(listener => listener(message))
        // Logger.log("Short update", message)
    }

    processUpdateShortMessage(message, messageID, sessionID) {
        //console.log(message)
        this.updateShortMessagesListeners.forEach(listener => listener(message))
        // Logger.log("Short update", message)
    }

    processUpdateNewMessage(message, messageID, sessionID) {
        // console.log(message)
        this.updateNewMessagesListeners.forEach(listener => listener(message))
        // Logger.log("Short update", message)
    }


    processUpdateNewChannelMessage(message, messageID, sessionID) {
        //console.log(message)
        this.updateNewChannelMessagesListeners.forEach(listener => listener(message))
        // Logger.log("Short update", message)
    }

    processNewSessionCreated(message, messageID, sessionID) {

    }

    processUpdates(message, messageID, sessionID) {
        //console.log(message)
        message.users.forEach(user => PeersManager.set(user))
        message.chats.forEach(user => PeersManager.set(user))

        message.updates.forEach(update => {
            if (this.handlers[update._]) {
                this.handlers[update._](update)
            } else {
                console.warn("unexprected update", update)
            }
        })
    }

    listenUpdateReadHistoryOutbox(listener) {
        this.updateReadHistoryOutboxListeners.push(listener)
    }

    listenUpdateDialogUnreadMark(listener) {
        this.updateDialogUnreadMarkListeners.push(listener)
    }

    listenUpdateReadHistoryInbox(listener) {
        this.updateReadHistoryInboxListeners.push(listener)
    }

    listenUpdateDraftMessage(listener) {
        this.updateDraftMessageListeners.push(listener)
    }

    listenUpdateEditChannelMessage(listener) {
        this.updateEditChannelMessageListeners.push(listener)
    }


    listenUpdateShort(listener) {
        this.updateShortListeners.push(listener)
    }

    listenUpdateShortMessage(listener) {
        this.updateShortMessagesListeners.push(listener)
    }

    listenUpdateNewMessage(listener) {
        this.updateNewMessagesListeners.push(listener)
    }

    listenUpdateNewChannelMessage(listener) {
        this.updateNewChannelMessagesListeners.push(listener)
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
        this.networker.updateServerSalt(longToBytes(message.new_server_salt))
        this.networker.resendMessage(message.bad_msg_id)
    }

    processPong(message, messageID, sessionID) {
        const handler = this.pongHandlers[message.msg_id]
        if(handler) {
            handler(message)
        }
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
