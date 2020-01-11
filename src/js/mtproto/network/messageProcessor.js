import {createLogger} from "../../common/logger"
import {longToBytes} from "../utils/bin";
import PeersManager from "../../api/peers/peersManager"
import {UserPeer} from "../../dataObjects/userPeer"

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

        this.updateShortListeners = []
        this.updateShortMessageListeners = []
        this.updateShortSentMessageListeners = []
        this.updateShortChatMessageListeners = []
        this.updatesCombinedListeners = []
        this.updatesListeners = []
        this.updateReadHistoryInboxListeners = []
        this.updateReadHistoryOutboxListeners = []
        this.updateReadChannelInboxListeners = []
        this.updateReadChannelOutboxListeners = []
        this.updateNewMessageListeners = []
        this.updateNewChannelMessageListeners = []
        this.updateDialogPinnedListeners = []
        this.updateDraftMessageListeners = []

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
            "updateShortChatMessage": this.processUpdateShortChatMessage.bind(this),
            "updateShortSentMessage": this.processUpdateShortSentMessage.bind(this),
            "updates": this.processUpdates.bind(this),
            "updatesCombined": this.processUpdatesCombined.bind(this),
            "updateReadChannelInbox": this.processUpdateReadChannelInbox.bind(this),
            "updateReadChannelOutbox": this.processUpdateReadChannelOutbox.bind(this),
            "updateReadHistoryInbox": this.processUpdateReadHistoryInbox.bind(this),
            "updateReadHistoryOutbox": this.processUpdateReadHistoryOutbox.bind(this),
            "updateDialogPinned": this.processUpdateDialogPinned.bind(this),
            "updateDraftMessage": this.processUpdateDraftMessage.bind(this),
        }
    }

    processUpdateShort(message, messageID, sessionID) {
        this.updateShortListeners.forEach(listener => listener(message.update))
        // Logger.log("Short update", message)
    }

    processUpdatesCombined(message, messageID, sessionID) {
        this.updatesCombinedListeners.forEach(listener => listener(message))
    }

    processUpdateShortChatMessage(message, messageID, sessionID) {
        this.updateShortChatMessageListeners.forEach(listener => listener(message))
    }

    processUpdateShortMessage(message, messageID, sessionID) {
        this.updateShortMessageListeners.forEach(listener => listener(message))
        // Logger.log("Short update", message)
    }

    processUpdateNewMessage(message, messageID, sessionID) {
        this.updateNewMessageListeners.forEach(listener => listener(message))
        // Logger.log("Short update", message)
    }

    processUpdateNewChannelMessage(message, messageID, sessionID) {
        this.updateNewChannelMessageListeners.forEach(listener => listener(message))
        // Logger.log("Short update", message)
    }

    processUpdateShortSentMessage(message, messageID, sessionID) {
        this.updateShortSentMessageListeners.forEach(listener => listener(message))
        // Logger.log("Short update", message)
    }

    processUpdateDialogPinned(message, messageID, sessionID) {
        this.updateDialogPinnedListeners.forEach(listener => listener(message))
        // Logger.log("Short update", message)
    }

    processNewSessionCreated(message, messageID, sessionID) {

    }

    processUpdateReadHistoryInbox(message, messageID, sessionID) {
        this.updateReadHistoryInboxListeners.forEach(listener => listener(message))
    }

    processUpdateReadChannelInbox(message, messageID, sessionID) {
        this.updateReadChannelInboxListeners.forEach(listener => listener(message))
    }

    processUpdateReadChannelOutbox(message, messageID, sessionID) {
        this.updateReadChannelOutboxListeners.forEach(listener => listener(message))
    }

    processUpdateReadHistoryOutbox(message, messageID, sessionID) {
        this.updateReadHistoryOutboxListeners.forEach(listener => listener(message))
    }

    processUpdateDraftMessage(message, messageID, sessionID) {
        this.updateDraftMessageListeners.forEach(listener => listener(message))
    }

    processUpdates(message, messageID, sessionID) {
        message.users.forEach(user => PeersManager.set(new UserPeer(user)))
        // this.updatesListeners.forEach(listener => listener(message))
        // message.chats.forEach(user => PeersManager.set(new ChatPeer(user)))
        //
        message.updates.forEach(update => {
            if (this.handlers[update._]) {
                this.handlers[update._](update)
            } else {
                console.warn("unexpected update", update)
            }
        })
    }

    listenUpdatesCombined(listener) {
        this.updatesCombinedListeners.push(listener)
    }

    listenUpdates(listener) {
        this.updatesListeners.push(listener)
    }

    listenUpdateDialogPinned(listener) {
        this.updateDialogPinnedListeners.push(listener)
    }

    listenUpdateShortChatMessage(listener) {
        this.updateShortChatMessageListeners.push(listener)
    }

    listenUpdateShortSentMessage(listener) {
        this.updateShortSentMessageListeners.push(listener)
    }

    listenUpdateShort(listener) {
        this.updateShortListeners.push(listener)
    }

    listenUpdateShortMessage(listener) {
        this.updateShortMessageListeners.push(listener)
    }

    listenUpdateNewMessage(listener) {
        this.updateNewMessageListeners.push(listener)
    }

    listenUpdateNewChannelMessage(listener) {
        this.updateNewChannelMessageListeners.push(listener)
    }

    listenUpdateReadHistoryInbox(listener) {
        this.updateReadHistoryInboxListeners.push(listener)
    }

    listenUpdateReadChannelInbox(listener) {
        this.updateReadChannelInboxListeners.push(listener)
    }

    listenUpdateReadChannelOutbox(listener) {
        this.updateReadChannelOutboxListeners.push(listener)
    }

    listenUpdateReadHistoryOutbox(listener) {
        this.updateReadHistoryOutboxListeners.push(listener)
    }

    listenUpdateDraftMessage(listener) {
        this.updateDraftMessageListeners.push(listener)
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
