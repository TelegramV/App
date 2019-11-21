import {AppFramework} from "../../../framework/framework"
import VDOM from "../../../framework/vdom"
import {create$loadingNode, vLoadingNode} from "../../../utils"
import PeersManager from "../../../../api/peers/peersManager"
import MessagesManager from "../../../../api/messages/messagesManager"
import {getPeerName} from "../../../../api/dialogs/util"
import {UICreateMessage} from "./message"
import DialogsManager from "../../../../api/dialogs/dialogsManager"

let $messagesElement = document.createElement("div")
let _page_peer = null
let $sticky = []

function get$bubbles() {
    return $messagesElement.querySelector("#bubbles-inner")
}

function onScrollMessages(peer) {
    return event => {
        const $element = event.target

        if ($element.scrollTop === 0) {
            MessagesManager.fetchNextPage(peer)
        }
    }
}


function createStickyDate(message) {
    const date = new Date(message.time)

    return VDOM.render(
        <div className="service date">
            <div className="service-msg">{date.toLocaleDateString("en", {
                month: "long",
                day: "2-digit"
            })}</div>
        </div>
    )
}

function render(peer) {
    return VDOM.render(
        <div id="chat" data-peer={AppFramework.Router.activeRoute.queryParams.p}>
            <div id="topbar">
                <div className="chat-info">
                    <div className="person">
                        <div id="messages-photo"
                             className={"avatar " + (!peer.photo ? `placeholder-${peer.photoPlaceholder.num}` : "")}
                             style={`background-image: url(${peer.photo});`}>
                            {!peer.photo ? peer.photoPlaceholder.text[0] : ""}
                        </div>
                        <div className="content">
                            <div className="top">
                                <div id="messages-title" className="title">
                                    {getPeerName(peer)}
                                </div>
                            </div>
                            <div className="bottom">
                                <div id="messages-online" className="info">{peer.online ? "online" : "offline"}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pinned-msg"/>
                <div className="btn-icon rp rps tgico-search"/>
                <div className="btn-icon rp rps tgico-more"/>
            </div>
            <div id="bubbles" onScroll={onScrollMessages(peer)}>
                <div id="bubbles-inner">
                </div>
            </div>
        </div>
    )
}

function rerender(peer) {
    $messagesElement = VDOM.mount(render(peer), $messagesElement)
}

function isOtherDay(date1, date2) {
    // fixme
    if (!date1 || !date2) return false

    return date1.getFullYear() !== date2.getFullYear() || date1.getMonth() !== date2.getMonth() || date1.getDay() !== date2.getDay()
}

let $latestSticky = null

function appendMessages(messages) {
    const $bubblesInner = get$bubbles()

    if ($bubblesInner) {
        const $bubbles = document.getElementById("bubbles")

        if ($latestSticky && !isOtherDay(messages[0].time, $latestSticky.date)) {
            $latestSticky.elem.parentElement.removeChild($latestSticky.elem)
        }
        let latest = null
        let final = null

        let k = $bubblesInner.clientHeight

        messages.forEach(message => {
            if (latest && isOtherDay(message.time, latest.time)) {
                let s = createStickyDate(latest)
                if (s) $bubblesInner.appendChild(s)
                final = latest.time
                latest = null
            }
            if (!latest) latest = message

            $bubblesInner.appendChild(VDOM.render(UICreateMessage(message)))
        })

        if (latest) {
            let s = createStickyDate(latest)
            if (s) $bubblesInner.appendChild(s)
            final = latest.time
            latest = null
        }

        const all = document.querySelectorAll(".date.service")
        $latestSticky = {
            elem: all[all.length - 1],
            date: final
        }
        $bubbles.scrollTop += $bubblesInner.clientHeight - k


    }
}

function prependMessages(messages) {
    const $bubblesInner = get$bubbles()

    if ($bubblesInner) {
        const $bubbles = document.getElementById("bubbles")

        // if($latestSticky && !isOtherDay(messages[messages.length - 1].time, $latestSticky.date)) {
        //     $latestSticky.elem.parentElement.removeChild($latestSticky.elem)
        // }
        let reset = false
        if ($bubblesInner.clientHeight - ($bubbles.scrollTop + $bubbles.clientHeight) < 50) {
            reset = true
        }
        messages.forEach(message => {
            // todo sticky date
            $bubblesInner.prepend(VDOM.render(UICreateMessage(message)))
        })
        if (reset) {
            $bubbles.scrollTop = $bubblesInner.clientHeight
        }
    }
}

function fetchNextPage(peer) {
    console.log("fetching new messages pages")
    const $bubblesInner = get$bubbles()
    $bubblesInner.appendChild(VDOM.render(
        <div id="messagesLoadingNextPage" className="full-size-loader height">
            <progress className="progress-circular big"/>
        </div>
    ))

    MessagesManager.fetchNextPage(peer).then(() => {
        $bubblesInner.querySelector("#messagesLoadingNextPage").remove()
    })
}

function refetchMessages() {
    if (AppFramework.Router.activeRoute.queryParams.p) {
        const queryPeer = parseHashQuery()
        _page_peer = PeersManager.find(queryPeer._, queryPeer.id)

        $messagesElement = VDOM.mount(create$loadingNode(), $messagesElement)

        if (!_page_peer) {

            PeersManager.listenPeerInit(queryPeer._, queryPeer.id, upcomePeer => {
                _page_peer = upcomePeer
                if (upcomePeer._ === queryPeer._ && upcomePeer.id === queryPeer.id) {
                    rerender(_page_peer)
                    MessagesManager.fetchMessages(upcomePeer)
                }
            })

        } else {
            if (MessagesManager.existForPeer(_page_peer)) {
                rerender(_page_peer)
                const all = MessagesManager.allForPeer(_page_peer)
                appendMessages(all)
                if (all.length < 20) {
                    fetchNextPage(_page_peer)
                }
            } else {
                if (_page_peer._ === queryPeer._ && _page_peer.id === queryPeer.id) {
                    rerender(_page_peer)
                    MessagesManager.fetchMessages(_page_peer)
                }
            }
        }
    } else {
        $messagesElement.replaceWith(VDOM.render(
            vLoadingNode
        ))
    }
}

function handleMessageUpdates(event) {
    if (AppFramework.Router.activeRoute.queryParams.p) {
        const queryPeer = parseHashQuery()
        if (event.peer._ === queryPeer._ && event.peer.id === queryPeer.id) {
            switch (event.type) {
                case "updateMany":
                    handleManyUpdate(event)
                    // console.log(event)
                    break
                case "updateSingle":
                    handleSingleUpdate(event)
                    // console.log(event)
                    break
                case "pushTop":
                    handlePushTop(event)
                    break
            }
        }
    }
}

function handlePushTop(event) {
    prependMessages([event.message])
}

function handleSingleUpdate(event) {
    const message = event.message

    const $message = $messagesElement.querySelector(`#bubbles-inner>[data-id="${message.id}"]`)

    if ($message) {
        // $message.replaceWith(VDOM.render(UICreateMessage(message)))

        // WARNING!!!
        // If message renders not as expected, then try to uncomment code above and do comment below

        VDOM.patchReal($message, UICreateMessage(message))
    }
}

function handleManyUpdate(event) {
    const messages = event.messages

    appendMessages(messages)
}

function parseHashQuery() {
    const queryPeer = AppFramework.Router.activeRoute.queryParams.p.split(".")

    if (queryPeer.length < 2) {
        throw Error("invalid peer")
    }

    return {_: queryPeer[0], id: Number(queryPeer[1])}
}

function handleDialogUpdates(event) {
    if (event.type === "updateSingle") {
        if (AppFramework.Router.activeRoute.queryParams.p) {
            const queryPeer = parseHashQuery()
            const dialog = event.dialog

            if (dialog.peer._ === queryPeer._ && dialog.peer.id === queryPeer.id) {
                const peerByManager = PeersManager.find(dialog.peer._, dialog.peer.id)
                if (peerByManager) {
                    _page_peer = peerByManager

                    console.log(peerByManager)

                    if (peerByManager.photo) {
                        updateHeader({
                            title: dialog.title,
                            photo: {
                                url: peerByManager.photo
                            },
                            online: peerByManager.online ? "online" : "offline"
                        })
                    } else {
                        updateHeader({
                            title: dialog.title,
                            photo: {
                                placeholder: {
                                    num: peerByManager.photoPlaceholder.num,
                                    text: peerByManager.photoPlaceholder.text,
                                }
                            },
                            online: peerByManager.online ? "online" : "offline"
                        })
                    }
                }
            }
        }
    }
}

function updateHeader({title = false, online = false, photo = false}) {
    const $messagesTitle = $messagesElement.querySelector("#messages-title")
    const $messagesOnline = $messagesElement.querySelector("#messages-online")
    const $messagesPhoto = $messagesElement.querySelector("#messages-photo")

    if (title) $messagesTitle.innerHTML = title
    if (online) $messagesOnline.innerHTML = online

    if (photo && $messagesPhoto) {
        if (photo.url) {
            $messagesPhoto.setAttribute("class", "avatar")
            $messagesPhoto.style = `background-image: url(${photo.url})`
            $messagesPhoto.innerHTML = ""
        } else {
            $messagesPhoto.setAttribute("class", "avatar " + `placeholder-${photo.placeholder.num}`)
            $messagesPhoto.innerHTML = photo.placeholder.text[0]
        }
    }
}

function updateMessageAvatar(peer) {
    const $messagesAvatars = $messagesElement.querySelectorAll(`#bubbles-inner>[data-peer="${peer._}.${peer.id}"]>.avatar`)

    if ($messagesAvatars) {
        $messagesAvatars.forEach($avatar => {
            if (peer.photo) {
                $avatar.setAttribute("class", "avatar")
                $avatar.style = `background-image: url(${peer.photo})`
                $avatar.innerHTML = ""
            } else {
                $avatar.setAttribute("class", "avatar " + `placeholder-${peer.photoPlaceholder.num}`)
                $avatar.innerHTML = peer.photoPlaceholder.text[0]
            }
        })
    }
}

function handlePeerUpdates(event) {
    if (event.type === "updatePhoto") {
        updateMessageAvatar(event.peer)

        if (event.peer.id === _page_peer.id) {
            if (event.peer.photo) {
                updateHeader({
                    photo: {
                        url: event.peer.photo
                    }
                })
            } else {
                updateHeader({
                    photo: {
                        placeholder: {
                            num: event.peer.photoPlaceholder.num,
                            text: event.peer.photoPlaceholder.text,
                        }
                    }
                })
            }
        }
    }
}

export function UICreateMessages() {
    MessagesManager.listenUpdates(handleMessageUpdates)
    DialogsManager.listenUpdates(handleDialogUpdates)
    PeersManager.listenUpdates(handlePeerUpdates)

    let $noChatSelected = VDOM.render(
        <div id="noChat">
            <div className="placeholder tgico tgico-chatsplaceholder"/>
            <div className="text"><p>Open Chat</p> <p>or create a new one</p></div>
            <div className="buttons">
                <div className="button-wrapper">
                    <div className="button rp"><i class="tgico tgico-newprivate"/></div>
                    <p>Private</p>
                </div>
                <div className="button-wrapper">
                    <div className="button rp"><i class="tgico tgico-newgroup"/></div>
                    <p>Group</p>
                </div>
                <div className="button-wrapper">
                    <div className="button rp"><i class="tgico tgico-newchannel"/></div>
                    <p>Channel</p>
                </div>
            </div>
        </div>
    );

    AppFramework.Router.onQueryChange(queryParams => {
        if (queryParams.p) {
            refetchMessages()
        } else {
            $messagesElement = VDOM.mount($noChatSelected, $messagesElement)
        }
    })

    if (!AppFramework.Router.activeRoute.queryParams.p) {
        return $messagesElement = $noChatSelected
    }

    refetchMessages()

    return $messagesElement = VDOM.render(
        vLoadingNode
    )
}
