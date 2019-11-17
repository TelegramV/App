import DialogsManager from "../../../../api/dialogs/dialogsManager"
import VDOM from "../../../framework/vdom"
import {UICreateDialog} from "./dialog"
import PeersManager from "../../../../api/peers/peersManager"

const $sidebar = VDOM.render(
    <div className="chatlist">
        <div className="toolbar">
            <div className="btn-icon rp rps tgico-menu"/>
            <div className="search">
                <div className="input-search">
                    <input type="text" placeholder="Search"/>
                    <span className="tgico tgico-search"/>
                </div>
            </div>
        </div>

        <div className="connecting" id="connecting_message">
            <progress className="progress-circular"/>
            <span>Waiting for network...</span>
        </div>

        <div id="dialogsWrapper" onScroll={onScrollDialogs}>
            <div id="dialogsPinned" className="list pinned"/>
            <div id="dialogs" className="list"/>
        </div>
    </div>
)

const __rendered_pinned = new Set()
const __rendered = new Set()

const $dialogsWrapper = $sidebar.querySelector("#dialogsWrapper")
const $dialogsPinned = $sidebar.querySelector("#dialogsPinned")
const $dialogs = $sidebar.querySelector("#dialogs")

function handleDialogUpdates(event) {
    if (event.type === "updateMany") {
        event.pinnedDialogs.forEach(dialog => {
            renderDialog(dialog, true)
        })

        event.dialogs.forEach(dialog => {
            renderDialog(dialog, false)
        })
    } else if (event.type === "updateSingle") {
        renderDialog(event.dialog, event.dialog.pinned)
    }
}

function handlePeerUpdates(event) {
    if (event.type === "updatePhoto") {
        const $dialogAvatar = $dialogsWrapper.querySelector(`[data-peer="${event.peer._}.${event.peer.id}"]>.avatar`)

        if ($dialogAvatar) {
            if (event.peer.photo) {
                $dialogAvatar.setAttribute("class", "avatar")
                $dialogAvatar.style = `background-image: url(${event.peer.photo})`
                $dialogAvatar.innerHTML = ""
            } else {
                $dialogAvatar.setAttribute("class", "avatar " + `placeholder-${event.peer.photoPlaceholder.num}`)
                $dialogAvatar.innerHTML = event.peer.photoPlaceholder.text[0]
            }
        } else {
            console.warn("dialogAvatar is not on the page")
        }
    } else if (event.type === "updateOnline") {
        const $dialog = $dialogsWrapper.querySelector(`[data-peer="${event.peer._}.${event.peer.id}"]`)

        if ($dialog) {
            if (event.status.was_online) {
                $dialog.classList.remove("online")
            } else {
                $dialog.classList.remove("online")
            }
        }
    }
}

function renderDialog(dialog, pinned = false) {
    const __ = `${dialog.peer._}.${dialog.peer.id}`

    const peer = PeersManager.find(dialog.peer._, dialog.peer.id)

    if (pinned) {
        if (__rendered_pinned.has(__)) {
            const $dialog = $dialogsPinned.querySelector(`[data-peer="${dialog.peer._}.${dialog.peer.id}"]`)

            if ($dialog) {
                if (Number($dialog.dataset.messageId) < dialog.message.id) {
                    $dialogsPinned.prepend($dialog)
                }
                // fix this later!!
                $dialog.replaceWith(UICreateDialog(dialog, peer))
            } else {
                console.warn("dialog is not on the page")
            }
        } else {
            __rendered_pinned.add(__)
            $dialogsPinned.appendChild(UICreateDialog(dialog, peer))
        }
    } else {
        if (__rendered.has(__)) {
            const $dialog = $dialogs.querySelector(`[data-peer="${dialog.peer._}.${dialog.peer.id}"]`)

            if ($dialog) {
                if (Number($dialog.dataset.messageId) < dialog.message.id) {
                    $dialogs.prepend($dialog)
                }
                // fix this later!!
                $dialog.replaceWith(UICreateDialog(dialog, peer))
            } else {
                console.warn("dialog is not on the page")
            }
        } else {
            __rendered.add(__)
            $dialogs.appendChild(UICreateDialog(dialog, peer))
        }
    }
}

function onScrollDialogs(event) {
    const $element = event.target
    if ($element.scrollHeight - $element.scrollTop === $element.clientHeight) {
        DialogsManager.fetchNextPage({})
    }
}

export function UICreateDialogsSidebar() {
    DialogsManager.listenUpdates(handleDialogUpdates)
    PeersManager.listenUpdates(handlePeerUpdates)

    return $sidebar
}
