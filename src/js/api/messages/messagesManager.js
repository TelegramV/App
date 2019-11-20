import MTProto from "../../mtproto"
import {PeerAPI} from "../peerAPI"
import PeersManager from "../peers/peersManager"
import {nextRandomInt} from "../../mtproto/utils/bin"
import {AppFramework} from "../../ui/framework/framework"
import {parseMessageEntities} from "../../mtproto/utils/htmlHelpers"
import {FileAPI} from "../fileAPI"
import {findUserFromMessage, getPeerName} from "../dialogs/util"
import {formatTimeAudio} from "../../ui/utils"

window.pushMessage = function () {
    const dialogPeer = AppFramework.Router.activeRoute.queryParams.p.split(".")
    const peer = PeersManager.find(dialogPeer[0], Number(dialogPeer[1]))

    let newd = $messages[peer._][peer.id][nextRandomInt($messages[peer._][peer.id].length)]
    newd.message = newd.message + (new Date().getTime())

    if (nextRandomInt(1)) {
        $messages[peer._][peer.id].push(newd)
        // console.log("pushed", newd)
    } else {
        $messages[peer._][peer.id].unshift(0)
        $messages[peer._][peer.id][0] = newd
        // console.log("shifted", newd)
    }

    resolveListeners({
        type: "push",
    })
}

window.$messageee = () => {
    return $messages
}

const $messages = {
    user: {},
    chat: {},
    channel: {}
}

const $listeners = []

let __is_fetching = false
let __fetching_for = {
    _: 0,
    id: 0
}

function getMessages(messages, o = "inputMessageID") {
    return MTProto.invokeMethod("messages.getMessages", {
        id: [
            {
                _: o,
                id: messages
            }
        ]
    })
}

function createMessage(message, peer) {
    const from = PeersManager.find("user", message.from_id)
    const userName = getPeerName(from)
    const time = new Date(message.date * 1000)

    let messageToPush = {}
    if (message._ === "messageService") {
        messageToPush = {
            type: "service",
            id: message.id,
            message: message.action._ // TODO parse this properly
        }
    } else {
        messageToPush = {
            type: "text",
            id: message.id,
            message: parseMessageEntities(message.message, message.entities),
            out: message.pFlags.out,
            post: message.pFlags.post,
            post_author: message.post_author,
            time: time,
            views: message.views,
            peer: peer,
            from: from ? from : peer
        }
        // console.log(peer)
        if (peer._ === "chat" || peer._ === "channel")
            messageToPush.userName = userName


        if (message.fwd_from) {
            messageToPush.fwd = {
                from: "Test " + message.fwd_from.from_id,
                date: message.fwd_from.date

            }
        }

        if (message.reply_to_msg_id) {
            let replyTo = $messages[peer._][peer.id][message.reply_to_msg_id]

            //if(!replyTo) {
            {
                // console.log(message.reply_to_msg_id)
                getMessages(message.reply_to_msg_id, "inputMessageID").then(l => {
                    l.messages.forEach(q => {
                        if (q.from_id !== message.from_id && q.to_id.user_id !== message.to_id.used_id)
                            return
                        const user = findUserFromMessage(q, l)
                        updateSingle(peer, message.id, {
                            reply: {
                                name: getPeerName(user),
                                text: q.message
                            }
                        })
                    })
                })
            }
            /*messageToPush.reply = {
                name: PeersManager.find(),
                text: replyTo.message
            }*/
        }
    }

    return messageToPush
}

function fetchMessages(peer, props = {offset_id: 0}) {
    __is_fetching = true
    __fetching_for = {
        _: peer._,
        id: peer.id
    }
    return MTProto.invokeMethod("messages.getHistory", {
        peer: PeerAPI.getInput(peer),
        offset_id: props.offset_id,
        offset_date: 0,
        add_offset: 0,
        limit: 20,
        max_id: 0,
        min_id: 0,
        hash: 0
    }).then(messagesSlice => {
        __is_fetching = true
        __fetching_for = {
            _: 0,
            id: 0
        }

        if (!$messages[peer._]) {
            $messages[peer._] = {}
        }

        if (!$messages[peer._][peer.id]) {
            $messages[peer._][peer.id] = []
        }

        messagesSlice.chats.forEach(chat => {
            PeersManager.set(chat)
        })

        messagesSlice.users.forEach(user => {
            PeersManager.set(user)
        })

        const messagesToPush = []

        messagesSlice.messages.forEach(message => {


            const messageToPush = createMessage(message, peer)

            messagesToPush.push(messageToPush)

            $messages[peer._][peer.id].push(messageToPush)

            if (message.media) {
                fetchMessageMedia(message, peer)
            }
        })

        //$messages[peer._][peer.id].push(...messagesToPush)

        if (messagesSlice.messages.length > 0 || props.offset_id === 0) {
            resolveListeners({
                type: "updateMany",
                peer: peer,
                messages: messagesToPush
            })
        }
    })
}


function fetchMessageMedia(message, peer) {
    if (message.media.photo) {
        FileAPI.photoThumnail(message.media.photo, data => {
            updateSingle(peer, message.id, {
                type: "photo",
                imgSrc: data.src,
                imgSize: data.size,
                thumbnail: data.thumbnail
            })
        })
    } else if (message.media.webpage) {
        if (message.media.webpage._ === "webPageEmpty") {
            //
        } else {
            const webpage = message.media.webpage

            if (webpage.photo)
                FileAPI.photoThumnail(webpage.photo, data => {
                    updateSingle(peer, message.id, {
                        type: "url",
                        url: {
                            description: webpage.description,
                            url: webpage.response,
                            title: webpage.title,
                            siteName: webpage.site_name,
                            photo: data.src,
                            size: data.size,
                            thumbnail: data.thumbnail // TODO blur this
                        }
                    })
                })
        }
    } else if (message.media.document) {
        FileAPI.getFile(message.media.document, "").then(response => {
            const url = response
            message.media.document.attributes.forEach(attribute => {
                if (attribute._ === "documentAttributeVideo") {
                    updateSingle(peer, message.id, {
                        type: attribute.pFlags.round_message ? "round" : "video",
                        video: {
                            width: attribute.w,
                            height: attribute.h,
                            url: url,
                            type: message.media.document.mime_type,
                            duration: attribute.duration
                        }
                    })
                } else if (attribute._ === "documentAttributeSticker") {
                    updateSingle(peer, message.id, {
                        type: "sticker",
                        imgSrc: url
                    })

                } else if (attribute._ === "documentAttributeAudio") {
                    const waveToArray = (form) => {
                        let buf = "";
                        const arr = [];
                        for (let i in form) {
                            let n = form[i].toString(2);
                            n = "00000000".substr(n.length) + n;
                            buf += n;
                            while (buf.length > 5) {
                                arr.push(parseInt(buf.substr(0, 5), 2));
                                buf = buf.substr(5);
                            }
                        }
                        return arr;
                    }

                    let waveformOld = waveToArray(attribute.waveform)
                    let waveform = []
                    for (let i = 0; i < 50; i++) {
                        waveform.push(1 + waveformOld[Math.floor(i / 50 * waveformOld.length)])
                    }
                    updateSingle(peer, message.id, {
                        type: attribute.pFlags.voice ? "voice" : "audio",
                        audio: {
                            url: url,
                            waveform: waveform,
                            read: message.pFlags.media_unread ? "read" : "", // TODO
                            time: formatTimeAudio(attribute.duration)
                        }
                    })
                } else if (attribute._ === "documentAttributeFilename") {
                    // this.reactive.message.data.documentName = attribute.file_name
                } else {
                    console.log(attribute)
                    /*blob = blob.slice(0, blob.size, "octec/stream")
                    this.vNode = vMessageWithFileTemplate({
                        userName: userName,
                        message: messageMessage,
                        fileURL: URL.createObjectURL(blob),
                        fileName: message.media.document.mime_type,
                                            out: message.pFlags.out

                    })*/
                }
            })
        })
    }
}

function fetchNextPage(peer) {
    let latest = $messages[peer._][peer.id][$messages[peer._][peer.id].length - 1]

    return fetchMessages(peer, {offset_id: latest.id})
}

function resolveListeners(event) {
    if (event) {
        $listeners.forEach(listener => {
            listener(event)
        })
    } else {
        console.warn("invalid event", event)
    }
}

function listenUpdates(listener) {
    if (listener && typeof listener === "function") {
        $listeners.push(listener)
    }
}

function push(message) {
    if (message.peer._) {
        if (!$messages[message.peer._]) {
            $messages[message.peer._] = {}
        }

        if (!$messages[message.peer._][message.peer.id]) {
            $messages[message.peer._][message.peer.id] = []
        }

        $messages[message.peer._][message.peer.id].push(message)
    }
}

function initDataIfNeeded(peer) {
    if (peer._) {
        if (!$messages[peer._]) {
            $messages[peer._] = {}
        }

        if (!$messages[peer._][peer.id]) {
            $messages[peer._][peer.id] = []
        }
    }
}

function pushTopNew(message) {
    console.log(message)
    const from = PeersManager.find("user", message.from_id)

    initDataIfNeeded(from)

    const userName = getPeerName(from)
    const time = new Date(message.date * 1000)

    let messageToPush = createMessage(message, from)

    $messages[from._][from.id].unshift(0)
    $messages[from._][from.id][0] = messageToPush

    resolveListeners({
        type: "pushTop",
        message: messageToPush,
        peer: from
    })

    if (message.media) {
        fetchMessageMedia(message, from)
    }
}

function pushTopShort(message) {
    initDataIfNeeded({_: "user", id: message.user_id})

    let from = PeersManager.find("user", message.user_id)

    const userName = getPeerName(from)
    const time = new Date(message.date * 1000)
    let messageToPush = {}
    if (message._ === "messageService") {
        messageToPush = {
            type: "service",
            id: message.id,
            message: message.action._ // TODO parse this properly
        }
    } else {
        messageToPush = {
            type: "text",
            id: message.id,
            userName: userName,
            message: parseMessageEntities(message.message, message.entities),
            out: message.pFlags.out,
            post: false,
            post_author: "",
            time: time,
            views: 0,
            peer: from,
            from: from
        }

        if (message.fwd_from) {
            messageToPush.fwd = {
                from: "Test " + message.fwd_from.from_id,
                date: message.fwd_from.date

            }
        }

        if (message.reply_to_msg_id) {
            messageToPush.reply = {
                name: "kek",
                text: "lt"
            }
        }
    }

    $messages[from._][from.id].unshift(0)
    $messages[from._][from.id][0] = messageToPush

    resolveListeners({
        type: "pushTop",
        message: messageToPush,
        peer: from
    })
}

// todo implement
function find(peer, messageId) {
    if (!$messages[peer._]) {
        return null
    }

    if (!$messages[peer._][peer.id]) {
        return null
    }

    return $messages[peer._][peer.id].find(m => m.id === messageId)
}

function allForPeer(peer) {
    if (!$messages[peer._]) {
        return []
    }

    if (!$messages[peer._][peer.id]) {
        $messages[peer._][peer.id] = []
        return []
    }

    const len = $messages[peer._][peer.id].length

    if (len > 50) {
        $messages[peer._][peer.id] = $messages[peer._][peer.id].slice(0, 50)
    }

    return $messages[peer._][peer.id]
}

function isFetching() {
    return __is_fetching
}

function isFetchingFor(peer) {
    return __fetching_for._ == peer._ && __fetching_for.id == peer.id
}

function updateSingle(peer, messageId, data, props = {}) {
    const message = find(peer, messageId)
    if (message) {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                message[key] = data[key]
            }
        }

        resolveListeners({
            type: "updateSingle",
            peer: peer,
            message: message
        })
    } else {
        console.warn("message wasn't found", peer, messageId)
    }
}

function existForPeer(peer) {
    if (!$messages[peer._]) {
        return false
    }

    return $messages[peer._][peer.id] ? $messages[peer._][peer.id].length > 0 : false
}

function init() {
    MTProto.MessageProcessor.listenUpdateShortMessage(update => {
        pushTopShort(update)
    })
    MTProto.MessageProcessor.listenUpdateNewMessage(update => {
        pushTopNew(update.message)
    })
    MTProto.MessageProcessor.listenUpdateNewChannelMessage(update => {
        console.log("??")
        pushTopNew(update.message)
    })
}

export const MessagesManager = {
    fetchNextPage,
    push,
    listenUpdates,
    allForPeer,
    fetchMessages,
    isFetchingFor,
    isFetching,
    existForPeer,
    init,
}

export default MessagesManager

