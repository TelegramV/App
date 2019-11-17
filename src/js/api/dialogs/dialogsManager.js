import {MTProto} from "../../mtproto"
import {nextRandomInt} from "../../mtproto/utils/bin"
import {
    findMessageFromDialog,
    findPeerFromDialog,
    findUserFromMessage,
    getInputPeerFromPeer,
    getPeerName,
    getPeerTemplateFromToId
} from "./util"
import TimeManager from "../../mtproto/timeManager"
import {generateDialogIndex, getMessageLocalID} from "./messageIdManager"
import {getMessagePreviewDialog} from "../../ui/utils"
import PeersManager from "../peers/peersManager"
import {FileAPI} from "../fileAPI"

window.pushDialog = function () {
    let newd = $dialogs[nextRandomInt($dialogs.length)]
    newd.date = new Date()
    $dialogs.push(newd)

    resolveListeners({
        type: "fetch",
        props: {
            fetched: __is_fetched,
            empty: __is_empty,
            sorted: __is_latest_sorted
        }
    })
}

const $dialogs = []
const $pinnedDialogs = []
const $listeners = []

let $offsetDate = 0
let $offsetID = 0
let $dialogsOffsetDate = 0
let $offsetIndex = 0

let __is_latest_sorted = false
let __is_fetching = true // init with false later
let __is_fetched = false
let __is_empty = false

function fetchDialogs({
                          limit = 20,
                          flags = {},
                          exclude_pinned = false,
                          folder_id = "",
                          offset_date = "",
                          offset_id = "",
                          offset_peer = {
                              _: "inputPeerEmpty"
                          },
                          hash = ""
                      }) {

    __is_latest_sorted = false
    __is_fetching = true

    if ($dialogsOffsetDate) {
        $offsetDate = $dialogsOffsetDate + TimeManager.timeOffset
        $offsetIndex = $dialogsOffsetDate * 0x10000
        flags |= 1
    }


    return MTProto.invokeMethod("messages.getDialogs", {
        flags: flags,
        exclude_pinned: exclude_pinned,
        folder_id: folder_id,
        offset_date: $offsetDate,
        offset_id: getMessageLocalID($offsetID),
        offset_peer: offset_peer,
        limit: limit,
        hash: hash
    }).then(dialogsSlice => {
        __is_fetched = false

        if (Number(dialogsSlice.count) === 0) {
            __is_empty = true
            return
        }

        const pinnedDialogsToPush = []
        const dialogsToPush = []

        for (let dialog of dialogsSlice.dialogs) {
            const pinned = dialog.pFlags.hasOwnProperty("pinned") ? dialog.pFlags.pinned : false

            const peer = findPeerFromDialog(dialog, dialogsSlice)
            let peerName = getPeerName(peer)

            const message = findMessageFromDialog(dialog, dialogsSlice)
            const messageUser = findUserFromMessage(message, dialogsSlice)
            let messageUsername = `${getPeerName(messageUser, false)}`
            let messageSelf = messageUser ? messageUser.id === peer.id : false

            $offsetDate = message.date

            const submsg = message.message;
            const date = new Date(message.date * 1000)

            const msgPrefix = getMessagePreviewDialog(message, messageUsername.length > 0)

            const data = {
                title: peerName,
                pinned: pinned,
                muted: dialog.notify_settings.mute_until,
                photo: false,
                unreadCount: dialog.unread_count,
                unreadMark: dialog.pFlags.unreadMark,
                unreadMentionsCount: dialog.unread_mentions_count,
                verified: peer.pFlags.verified,
                online: peer.status && peer.status._ === "userStatusOnline",
                read: message.id <= dialog.read_inbox_max_id,
                out: message.pFlags.out,
                message: {
                    sender: messageUsername + msgPrefix,
                    text: submsg,
                    self: messageSelf,
                    date: date,
                    id: message.id,
                },
                peer: {
                    _: peer._,
                    id: peer.id,
                    access_hash: peer.access_hash
                },
                index: generateDialogIndex(message.date)
            }

            if ($offsetDate && !dialog.pFlags.pinned && (!$dialogsOffsetDate || $offsetDate < $dialogsOffsetDate)) {
                $dialogsOffsetDate = $offsetDate
            }

            if (pinned) {
                pinnedDialogsToPush.push(data)
            } else {
                dialogsToPush.push(data)
            }

            PeersManager.set(peer)
        }

        $pinnedDialogs.push(...pinnedDialogsToPush)
        $dialogs.push(...dialogsToPush)

        __is_fetching = false
        __is_fetched = true

        resolveListeners({
            type: "updateMany",
            dialogs: dialogsToPush,
            pinnedDialogs: pinnedDialogsToPush,
        })
    })

}

export function fetchNextPage({limit = 20}) {
    const latestDialog = $dialogs[$dialogs.length - 1]
    const peer = latestDialog.peer

    const offsetPeer = getInputPeerFromPeer(peer._, peer.id)

    const data = {
        limit: limit,
        offset_peer: offsetPeer
    }

    return fetchDialogs(data)
}

function fetchPhoto(peer, props = {}) {
    let photoSmall = peer.photo.photo_small
    try {
        FileAPI.getPeerPhoto(photoSmall, peer.photo.dc_id, peer, false).then(url => {
            updateSingle(peer, {
                photo: url
            }, props)
        }).catch(e => {

        })
    } catch (e) {
        console.log(e)
    }
}

function createDialogFromMessage(message) {
    const pinned = dialog.pFlags.hasOwnProperty("pinned") ? dialog.pFlags.pinned : false

    const peer = PeersManager.findObj(message.peer)
    let peerName = getPeerName(peer)

    const messageUser = message.from
    let messageUsername = `${getPeerName(messageUser, false)}`
    let messageSelf = messageUser ? messageUser.id === peer.id : false

    $offsetDate = message.date

    // TODO this should be made with css
    const submsg = message.message ? (message.message.length > 16 ? (message.message.substring(0, 16) + "...") : message.message) : ""
    const date = new Date(message.date * 1000)

    const msgPrefix = getMessagePreviewDialog(message, messageUsername.length > 0)

    const data = {
        title: peerName,
        pinned: pinned,
        // muted: dialog.notify_settings.mute_until,
        photo: false,
        unreadCount: dialog.unread_count,
        unreadMark: dialog.pFlags.unreadMark,
        unreadMentionsCount: dialog.unread_mentions_count,
        verified: peer.pFlags.verified,
        online: peer.status && peer.status._ === "userStatusOnline",
        read: message.id <= dialog.read_inbox_max_id,
        out: message.pFlags.out,
        message: {
            sender: messageUsername + msgPrefix,
            text: submsg,
            self: messageSelf,
            date: date,
            id: message.id,
        },
        peer: {
            _: peer._,
            id: peer.id,
            access_hash: peer.access_hash
        },
        index: generateDialogIndex(message.date)
    }
}

function updateSingle(peer, data, props = {}) {
    let dialogs = []
    if (props.pinned) {
        dialogs = $pinnedDialogs
    } else {
        dialogs = $dialogs
    }

    const dialogIndex = dialogs.findIndex(dialog => dialog.peer._ === peer._ && dialog.peer.id === peer.id)

    if (dialogIndex >= 0) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                dialogs[dialogIndex][key] = data[key]
            }
        }

        resolveListeners({
            type: "updateSingle",
            dialog: dialogs[dialogIndex]
        })
    } else {
        console.warn("dialog wasn't found", peer)
    }
}

function refetchDialog(peer) {
    console.warn("trying to reload dialog", peer)
    return MTProto.invokeMethod("messages.getPeerDialogs", {
        peers: [
            {
                _: "inputDialogPeer",
                peer: getInputPeerFromPeer(peer._, peer.id, peer.access_hash)
            }
        ]
    }).then(peerDialogs => {
        console.log(peerDialogs)
        for (let dialog of peerDialogs.dialogs) {
            const pinned = dialog.pFlags.hasOwnProperty("pinned") ? dialog.pFlags.pinned : false

            const peer = findPeerFromDialog(dialog, peerDialogs)
            let peerName = getPeerName(peer)

            const message = findMessageFromDialog(dialog, peerDialogs)
            const messageUser = findUserFromMessage(message, peerDialogs)
            let messageUsername = `${getPeerName(messageUser, false)}`
            let messageSelf = messageUser ? messageUser.id === peer.id : false

            $offsetDate = message.date

            // TODO this should be made with css
            const submsg = message.message ? (message.message.length > 16 ? (message.message.substring(0, 16) + "...") : message.message) : ""
            const date = new Date(message.date * 1000)

            const msgPrefix = getMessagePreviewDialog(message, messageUsername.length > 0)

            const data = {
                title: peerName,
                pinned: pinned,
                muted: dialog.notify_settings.mute_until,
                photo: false,
                unreadCount: dialog.unread_count,
                unreadMark: dialog.pFlags.unreadMark,
                unreadMentionsCount: dialog.unread_mentions_count,
                verified: peer.pFlags.verified,
                online: peer.status && peer.status._ === "userStatusOnline",
                read: message.id <= dialog.read_inbox_max_id,
                out: message.pFlags.out,
                message: {
                    sender: messageUsername + msgPrefix,
                    text: submsg,
                    self: messageSelf,
                    date: date,
                    id: message.id,
                },
                peer: {
                    _: peer._,
                    id: peer.id,
                    access_hash: peer.access_hash
                },
                index: generateDialogIndex(message.date)
            }

            if ($offsetDate && !dialog.pFlags.pinned && (!$dialogsOffsetDate || $offsetDate < $dialogsOffsetDate)) {
                $dialogsOffsetDate = $offsetDate
            }

            updateSingle(peer, data, {
                pinned: data.pinned
            })

            PeersManager.set(peer)
        }
    })
}

function getDialogs() {
    if (__is_latest_sorted) {
        return {
            pinnedDialogs: $pinnedDialogs,
            dialogs: $dialogs
        }
    } else {
        // sortDialogs()
        return {
            pinnedDialogs: $pinnedDialogs,
            dialogs: $dialogs
        }
    }
}

// todo: fix sorting
function sortDialogs() {
    $dialogs.sort(function (x, y) {
        if (x.date > y.date) {
            return -1
        }
        if (x.date < y.date) {
            return 1
        }
        return 0
    });
    $pinnedDialogs.sort(function (x, y) {
        if (x.date > y.date) {
            return -1
        }
        if (x.date < y.date) {
            return 1
        }
        return 0
    });
}

function resolveListeners(event) {
    if (event) {
        $listeners.forEach(listener => {
            listener.listener(event)
            // if (listener.listenOnce) {
            //     unlistenUpdates(listener)
            // }
        })
    } else {
        console.warn("invalid event", event)
    }
}

function listenOnce(listener) {
    if (listener && typeof listener === "function") {
        $listeners.push({listener, listenOnce: true})
    }
}

function listenUpdates(listener) {
    if (listener && typeof listener === "function") {
        $listeners.push({listener, listenOnce: false})
    }
}

function unlistenUpdates(listener) {
    delete $listeners[listener]
}

function isFetching() {
    return __is_fetching
}

function isFetched() {
    return __is_fetching
}

function isEmpty() {
    return __is_empty
}

function init() {
    MTProto.MessageProcessor.listenUpdateShortMessage(update => {
        const messageUser = PeersManager.find("user", update.user_id)
        let messageUsername = `${getPeerName(messageUser, false)}`
        let messageSelf = messageUser ? messageUser.id === update.user_id : false

        const message = update

        const submsg = message.message ? (message.message.length > 16 ? (message.message.substring(0, 16) + "...") : message.message) : ""
        const date = new Date(message.date * 1000)

        const msgPrefix = getMessagePreviewDialog(message, messageUsername.length > 0)

        updateSingle({_: "user", id: message.user_id}, {
            message: {
                sender: messageUsername + msgPrefix,
                text: submsg,
                self: messageSelf,
                date: date,
                id: message.id,
            }
        })
    })
    MTProto.MessageProcessor.listenUpdateShortChatMessage(update => {
        const messageUser = PeersManager.find("chat", update.chat_id)
        let messageUsername = `${getPeerName(messageUser, false)}`
        let messageSelf = messageUser ? messageUser.id === update.user_id : false

        const message = update

        const submsg = message.message ? (message.message.length > 16 ? (message.message.substring(0, 16) + "...") : message.message) : ""
        const date = new Date(message.date * 1000)

        const msgPrefix = getMessagePreviewDialog(message, messageUsername.length > 0)

        updateSingle({_: "chat", id: message.chat_id}, {
            message: {
                sender: messageUsername + msgPrefix,
                text: submsg,
                self: messageSelf,
                date: date,
                id: message.id,
            }
        })
    })

    MTProto.MessageProcessor.listenUpdateNewMessage(update => {
        const diatpl = getPeerTemplateFromToId(update.message.to_id)
        let dialogIdToUpdate = update.message.from_id

        const messageUser = PeersManager.find("user", update.message.from_id)
        let messageUsername = `${getPeerName(messageUser, false)}`
        let messageSelf = messageUser ? messageUser.id === update.message.from_id : false

        const message = update.message

        if (message.pFlags.out) {
            dialogIdToUpdate = diatpl
        }

        const submsg = message.message ? (message.message.length > 16 ? (message.message.substring(0, 16) + "...") : message.message) : ""
        const date = new Date(message.date * 1000)

        const msgPrefix = getMessagePreviewDialog(message, messageUsername.length > 0)

        updateSingle({_: "user", id: dialogIdToUpdate.id}, {
            message: {
                sender: messageUsername + msgPrefix,
                text: submsg,
                self: messageSelf,
                date: date,
                id: message.id,
            }
        })
    })

    MTProto.MessageProcessor.listenUpdateNewChannelMessage((update => {
        const message = update.message

        let dialogToUpdate = null
        if (message.to_id) {
            dialogToUpdate = PeersManager.findObj(getPeerTemplateFromToId(update.message.to_id))
        } else {
            dialogToUpdate = PeersManager.find("user", message.from_id)
        }

        const messageUser = PeersManager.find("user", update.message.from_id)
        let messageUsername = `${getPeerName(messageUser, false)}`
        let messageSelf = messageUser ? messageUser.id === update.message.from_id : false

        const submsg = message.message ? (message.message.length > 16 ? (message.message.substring(0, 16) + "...") : message.message) : ""
        const date = new Date(message.date * 1000)

        const msgPrefix = getMessagePreviewDialog(message, messageUsername.length > 0)

        updateSingle(dialogToUpdate, {
            message: {
                sender: messageUsername + msgPrefix,
                text: submsg,
                self: messageSelf,
                date: date,
                id: message.id,
            }
        })
    }))
}

const DialogsManager = {
    fetchDialogs,
    getDialogs,
    listenUpdates,
    listenOnce,
    isFetching,
    isFetched,
    fetchNextPage,
    isEmpty,
    init,
    refetchDialog
}

export default DialogsManager
