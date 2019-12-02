import DialogsManager from "../../../../../api/dialogs/dialogsManager"
import PeersManager from "../../../../../api/peers/peersManager"
import VDOM from "../../../../framework/vdom"
import {DialogComponent} from "./dialogComponent"

function scrollHandler(event) {
    const $element = event.target
    if ($element.scrollHeight - $element.scrollTop === $element.clientHeight) {
        DialogsManager.fetchNextPage({})
    }
}

const __rendered_pinned = new Set()
const __rendered = new Set()

/**
 * @type {Element|undefined}
 */
let $pinnedDialogs = undefined

/**
 * @type {Element|undefined}
 */
let $generalDialogs = undefined

function handleDialogUpdates(event) {
    if (event.type === "updateMany") {
        event.pinnedDialogs.forEach(dialog => {
            renderDialog(dialog)
        })

        event.dialogs.forEach(dialog => {
            renderDialog(dialog)
        })

    } else if (event.type === "updateSingle") {
        renderDialog(event.dialog)
    } else {
        Logger.log("DialogUpdates", event)
    }
}

function handlePeerUpdates(event) {
    if (event.type === "updatePhoto") {
        const dialog = DialogsManager.find(event.peer.type, event.peer.id)
        if (dialog) {
            renderDialog(dialog)
        }
    } else {
        Logger.log("PeerUpdates", event)
    }
}

/**
 * @param {Dialog} dialog
 */
function renderDialog(dialog) {
    if (!$pinnedDialogs || !$generalDialogs) {
        throw new Error("$pinnedDialogs or $dialogs wasn't found on the page.")
    }

    const __ = `${dialog.type}.${dialog.id}`
    const renderedInPinned = __rendered_pinned.has(__)
    const renderedInGeneral = __rendered.has(__)

    let $dialogs = undefined

    if (renderedInPinned || dialog.pinned) {
        $dialogs = $pinnedDialogs
    } else if (renderedInGeneral) {
        $dialogs = $generalDialogs
    } else {
        __rendered.add(__)
        $dialogs = $generalDialogs // fixme
    }

    const $dialog = $dialogs.querySelector(`[data-peer="${__}"]`)

    if ($dialog) {
        if (parseInt($dialog.dataset.message) < dialog.lastMessage.id) {
            $dialogs.prepend($dialog)
        }

        VDOM.patchReal($dialog, <DialogComponent dialog={dialog}/>)
    } else {
        VDOM.appendToReal(<DialogComponent dialog={dialog}/>, $dialogs)
    }
}

function registerResizer($element) {
    const MIN_WIDTH = 90
    const DEFAULT_WIDTH = 422

    let sticked = false
    let prevPosition = $element.offsetX
    let isMoving = false

    const $connectingMessageText = $element.querySelector("#connecting_message>span")
    const $searchElement = $element.querySelector(".search")

    const setmin = () => {
        sticked = true
        $element.style.width = `${MIN_WIDTH}px`
        $searchElement.classList.add("d-none")
        $connectingMessageText.classList.add("d-none")
    }

    const setdef = () => {
        sticked = false
        $element.style.width = `${DEFAULT_WIDTH}px`
        $searchElement.classList.remove("d-none")
        $connectingMessageText.classList.remove("d-none")
    }

    const resize = event => {
        const computedSize = parseInt(getComputedStyle($element).width) + event.x - prevPosition

        if (computedSize < 150 && $searchElement) {
            $searchElement.classList.add("d-none")
        } else {
            $searchElement.classList.remove("d-none")
        }

        if (computedSize <= (MIN_WIDTH + 20) && !sticked) {
            setmin()
            prevPosition = event.x
        } else if (computedSize >= MIN_WIDTH) {
            sticked = false
            $element.style.width = `${computedSize}px`
            prevPosition = event.x
            $searchElement.classList.remove("d-none")
            $connectingMessageText.classList.remove("d-none")
        }
    }

    $element.addEventListener("mousedown", function (event) {
        isMoving = true
        if (event.offsetX > 10 && isMoving) {
            prevPosition = event.x

            document.addEventListener("mousemove", resize, false)
        }
    }, false)

    $element.addEventListener("dblclick", function (event) {
        const w = parseInt(getComputedStyle($element).width)
        if (w < DEFAULT_WIDTH) {
            setdef()
        } else {
            setmin()
        }
    })

    document.addEventListener("mouseup", function () {
        document.removeEventListener("mousemove", resize)
    }, false)
}

export const DialogListComponent = {
    name: "dialog-list",
    h() {
        return (
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

                <div id="dialogsWrapper" onScroll={scrollHandler}>
                    <div id="dialogsPinned" className="list pinned"/>
                    <div id="dialogs" className="list"/>
                </div>
            </div>
        )
    },

    mounted($element) {
        $pinnedDialogs = $element.querySelector("#dialogsPinned")
        $generalDialogs = $element.querySelector("#dialogs")

        DialogsManager.listenUpdates(handleDialogUpdates)
        PeersManager.listenUpdates(handlePeerUpdates)

        registerResizer($element)
    }
}
