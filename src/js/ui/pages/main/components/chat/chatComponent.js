import {Pinned} from "../../../../pinnedController"
import LoaderComponent from "../loading/loader"
import ChatInfoComponent from "./chatInfo/chatInfoComponent"
import BubblesComponent from "./bubblesComponent"
import AppSelectedDialog from "../../../../../api/dialogs/selectedDialog"


/**
 * CRITICAL: never rerender this component!
 */
const ChatComponent = {
    name: "messages-wrapper-component",
    reactive: {
        dialog: AppSelectedDialog.Reactive.FireOnly
    },
    state: {
        /**
         * @var {Dialog} dialog
         */
        dialog: AppSelectedDialog.Dialog,
    },
    /**
     * @property {Element|Node} elements.*
     */
    elements: {
        $fullLoader: undefined,
        $messagesLoader: undefined,
        $chatInfo: undefined,
        $pinned: undefined,
        $topbar: undefined,
        $bubbles: undefined,
        $bubblesInner: undefined,
        $latestSticky: undefined,
    },
    h() {
        return (
            <div id="chat">
                <LoaderComponent id="messages-wrapper-full-loader" full={true} show={false}/>

                <div id="topbar">
                    <ChatInfoComponent/>
                    <Pinned/>
                    <div className="btn-icon rp rps tgico-search"/>
                    <div className="btn-icon rp rps tgico-more"/>
                </div>

                <LoaderComponent id="messages-wrapper-messages-loader" full={true} show={true}/>

                <BubblesComponent/>
            </div>
        )
    },
    mounted() {
        // this.elements.$topbar = this.$el.querySelector("#topbar")
        // this.elements.$fullLoader = this.$el.querySelector("#messages-wrapper-full-loader")
        // this.elements.$chatInfo = this.elements.$topbar.querySelector("#messages-wrapper-chat-info")
        // this.elements.$pinned = this.elements.$topbar.querySelector("#messages-wrapper-pinned")
        //
        // this.elements.$bubbles = this.$el.querySelector("#bubbles")
        // this.elements.$bubblesInner = this.elements.$bubbles.querySelector("#bubbles-inner")
        // this.elements.$messagesLoader = this.$el.querySelector("#messages-wrapper-messages-loader")
    },
}

export default ChatComponent