import ChatInfoStatusComponent from "./chatInfoStatusComponent"
import ChatInfoAvatarComponent from "./chatInfoAvatarComponent"
import ChatInfoNameComponent from "./chatInfoNameComponent"
import Component from "../../../../../framework/vrdom/component"
import AppSelectedDialog from "../../../../../../api/dialogs/selectedDialog"

class ChatInfoComponent extends Component {
    constructor(props) {
        super(props)

        this.reactive = {
            dialog: AppSelectedDialog.Reactive.Default // reactive property
        }
    }

    h() {
        return (
            <div id="messages-wrapper-chat-info" className="chat-info">
                <div className="person">

                    <button class="responsive-only-mobile" onClick={this._backToMainPage}>
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

    _backToMainPage() {
        location.hash = "#/"
    }
}

export default ChatInfoComponent