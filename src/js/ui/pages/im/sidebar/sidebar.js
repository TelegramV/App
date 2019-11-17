import DialogsManager from "../../../../api/dialogs/dialogsManager"
import VDOM from "../../../framework/vdom"
import {UICreateDialog} from "./dialog"

const $sidebar = VDOM.render(
    <div className="chatlist" onScroll={onScrollDialogs}>
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

        <div>
            <div id="dialogsPinned" className="list pinned"/>
            <div id="dialogs" className="list"/>
        </div>
    </div>
)

const __rendered_pinned = new Set()
const __rendered = new Set()

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

function renderDialog(dialog, pinned = false) {
    const __ = `${dialog.peer._}.${dialog.peer.id}.${dialog.message.id}`

    if (pinned) {
        if (__rendered_pinned.has(__)) {
            const $dialog = $dialogsPinned.querySelector(`[data-peer="${dialog.peer._}.${dialog.peer.id}"]`)

            if ($dialog) {
                // fix this later!!
                $dialog.replaceWith(UICreateDialog(dialog))
            } else {
                console.warn("dialog is not on the page")
            }
        } else {
            __rendered_pinned.add(__)
            $dialogsPinned.appendChild(UICreateDialog(dialog))
        }
    } else {
        if (__rendered.has(__)) {
            const $dialog = $dialogs.querySelector(`[data-peer="${dialog.peer._}.${dialog.peer.id}"]`)

            if ($dialog) {
                // fix this later!!
                $dialog.replaceWith(UICreateDialog(dialog))
            } else {
                console.warn("dialog is not on the page")
            }
        } else {
            __rendered.add(__)
            $dialogs.appendChild(UICreateDialog(dialog))
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

    return $sidebar
}
