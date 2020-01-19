import ChatInfoStatusComponent from "./chatInfoStatusComponent"
import ChatInfoAvatarComponent from "./chatInfoAvatarComponent"
import ChatInfoNameComponent from "./chatInfoNameComponent"
import Component from "../../../../../framework/vrdom/component"
import AppSelectedDialog from "../../../../../../api/dialogs/selectedDialog"

class ChatInfoComponent extends Component {
    constructor() {
        super({
            reactive: {
                dialog: AppSelectedDialog.Reactive.Default // reactive property
            }
        });
    }

    h() {
        return (
            <div id="messages-wrapper-chat-info" className="chat-info">
                <div className="person">

                    <button class="responsive-only-mobile" onClick={() => location.hash = "#/"}>
                        {"<-"}
                    </button>

                    <ChatInfoAvatarComponent/>

                    <div className="content">

                        <div className="top">
                            <ChatInfoNameComponent/>
                        </div>

                        <ChatInfoStatusComponent/>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChatInfoComponent