import {MTProto} from "../../mtproto"
import {
    findMessageFromDialog,
    findPeerFromDialog,
    findUserFromMessage,
    getPeerName
} from "../../ui/pages/im/components/dialog"
import {FileAPI} from "../fileAPI"
import {nextRandomInt} from "../../mtproto/utils/bin"
import {getInputPeerFromPeer} from "./util"
import TimeManager from "../../mtproto/timeManager"
import {generateDialogIndex, getMessageLocalID} from "./messageIdManager"
import {getMessagePreviewDialog} from "../../ui/utils"
import PeersManager from "../peers/peersManager"

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

        for (let dialog of dialogsSlice.dialogs) {
            const pinned = dialog.pFlags.hasOwnProperty("pinned") ? dialog.pFlags.pinned : false

            const peer = findPeerFromDialog(dialog, dialogsSlice)
            let peerName = getPeerName(peer)

            const message = findMessageFromDialog(dialog, dialogsSlice)
            const messageUser = findUserFromMessage(message, dialogsSlice)
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
                photo: "/static/images/icons/admin_3x.png",
                unreadCount: dialog.unread_count,
                unreadMark: dialog.pFlags.unreadMark,
                unreadMentionsCount: dialog.unread_mentions_count,
                verified: peer.pFlags.verified,
                online: peer.status && peer.status._ === "userStatusOnline",
                message: {
                    sender: messageUsername + msgPrefix,
                    text: submsg,
                    self: messageSelf,
                    date: message.date,
                    id: message.id,
                },
                date: date,
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
                $pinnedDialogs.push(data)
            } else {
                $dialogs.push(data)
            }

            PeersManager.set(peer)

            if (peer.photo) {
                fetchPhoto(peer, {
                    pinned: pinned
                })
            }
        }

        __is_fetching = false
        __is_fetched = true

        resolveListeners({
            type: "fetch",
            props: {
                fetched: __is_fetched,
                empty: __is_empty,
                sorted: __is_latest_sorted
            }
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
        FileAPI.getPeerPhoto(photoSmall, peer, false).then(url => {

            updateSingle(peer, {
                photo: url
            }, props)
        }).catch(e => {

        })
    } catch (e) {
        console.log(e)
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
            props: {
                fetched: __is_fetched,
                empty: __is_empty,
                sorted: __is_latest_sorted
            }
        })
    } else {
        console.warn("dialog wasn't found", peer)
    }
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
            if (listener.listenOnce) {
                unlistenUpdates(listener)
            }
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

const DialogsManager = {
    fetchDialogs,
    getDialogs,
    listenUpdates,
    listenOnce,
    isFetching,
    isFetched,
    fetchNextPage,
    isEmpty
}

export default DialogsManager
