import {AppFramework} from "../../../framework/framework"
import VDOM from "../../../framework/vdom"
import {vLoadingNode} from "../../../utils"
import PeersManager from "../../../../api/peers/peersManager"
import MessagesManager from "../../../../api/messages/messagesManager"
import {getPeerName} from "../../../../api/dialogs/util"
import {UICreateMessage} from "./message"
import DialogsManager from "../../../../api/dialogs/dialogsManager"

let $messagesElement = document.createElement("div")
let peer = null

function onScrollMessages(peer) {
    return event => {
        const $element = event.target
        if ($element.scrollHeight - $element.scrollTop === $element.clientHeight) {
            MessagesManager.fetchNextPage(peer)
        }
    }
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
                    <div className="service">
                        <div className="service-msg">October 21</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function rerender(peer) {
    $messagesElement = VDOM.mount(render(peer), $messagesElement)
}

function appendMessages(messages) {
    const $bubblesInner = $messagesElement.querySelector("#bubbles-inner")

    if ($bubblesInner) {
        messages.forEach(message => {
            $bubblesInner.appendChild(UICreateMessage(message))
        })
    }
}

function refetchMessages() {
    if (AppFramework.Router.activeRoute.queryParams.p) {
        const queryPeer = parseHashQuery()
        peer = PeersManager.find(queryPeer._, queryPeer.id)

        if (!peer) {
            PeersManager.listenPeerInit(queryPeer._, queryPeer.id, upcomePeer => {
                peer = upcomePeer
                if (upcomePeer._ === queryPeer._ && upcomePeer.id === queryPeer.id) {
                    rerender(peer)
                    MessagesManager.fetchMessages(upcomePeer)
                }
            })
        } else {
            if (MessagesManager.existForPeer(peer)) {
                rerender(peer)
                appendMessages(MessagesManager.allForPeer(peer))
            } else {
                if (peer._ === queryPeer._ && peer.id === queryPeer.id) {
                    rerender(peer)
                    MessagesManager.fetchMessages(peer)
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
                    console.log(event)
                    break
                case "updateSingle":
                    handleSingleUpdate(event)
                    console.log(event)
                    break
            }
        }
    }
}

function handleSingleUpdate(event) {
    const message = event.message

    const $message = $messagesElement.querySelector(`#bubbles-inner>[data-id="${message.id}"]`)

    if ($message) {
        $message.replaceWith(UICreateMessage(message))
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
                    peer = peerByManager

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
                                    text: peerByManager.photoPlaceholder.title,
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

function updateHeader({title, online, photo}) {
    const $messagesTitle = $messagesElement.querySelector("#messages-title")
    const $messagesOnline = $messagesElement.querySelector("#messages-online")
    const $messagesPhoto = $messagesElement.querySelector("#messages-photo")

    $messagesTitle.innerHTML = title
    $messagesOnline.innerHTML = online

    if (photo.url) {
        $messagesPhoto.setAttribute("class", "avatar")
        $messagesPhoto.style = `background-image: url(${photo.url})`
        $messagesPhoto.innerHTML = ""
    } else {
        $messagesPhoto.setAttribute("class", "avatar" + `placeholder-${photo.placeholder.num}`)
        $messagesPhoto.innerHTML = photo.placeholder.text[0]
    }
}

export function UICreateMessages() {
    MessagesManager.listenUpdates(handleMessageUpdates)
    DialogsManager.listenUpdates(handleDialogUpdates)

    AppFramework.Router.onQueryChange(queryParams => {
        if (queryParams.p) {
            refetchMessages()
        } else {
            $messagesElement.replaceWith(VDOM.render(
                <h1>Select a chat</h1>
            ))
        }
    })

    if (!AppFramework.Router.activeRoute.queryParams.p) {
        return $messagesElement = VDOM.render(
            <h1>Select a chat</h1>
        )
    }

    refetchMessages()

    return $messagesElement = VDOM.render(
        vLoadingNode
    )
}
