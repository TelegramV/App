import {Pinned} from "../../../../pinnedController"
import MessagesWrapperChatInfoComponent from "./messagesWrapperChatInfoComponent"

const MessagesWrapperComponent = {
    name: "messages-wrapper-component",
    state: {
        dialog: {
            // ...
        }
    },
    h() {
        return (
            <div id="chat">
                {/*<div id="topbar">*/}
                {/*    <MessagesWrapperChatInfoComponent dialog={this.state.dialog}/>*/}
                {/*    <Pinned/>*/}
                {/*    <div className="btn-icon rp rps tgico-search"/>*/}
                {/*    <div className="btn-icon rp rps tgico-more"/>*/}
                {/*</div>*/}
                {/*<div id="bubbles" onScroll={this._onScrollBubbles.bind(this)}>*/}
                {/*    <div id="bubbles-inner">*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        )
    },
    mounted() {

    },
    _onScrollBubbles() {
        // handle it
    }
}

export default MessagesWrapperComponent