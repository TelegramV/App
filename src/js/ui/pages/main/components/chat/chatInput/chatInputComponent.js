import Component from "../../../../../framework/vrdom/component";
import AppSelectedDialog from "../../../../../../api/dialogs/selectedDialog";

export class ChatInputComponent extends Component {
    h() {
        return <div className="chat-input-wrapper">
            <div className="chat-input">

                <div className="input-field">
                    <i className="tgico tgico-smile"></i>
                    <div className="textarea empty" placeholder="Message" contentEditable onInput={this.onInput}/>
                    <i className="tgico tgico-attach"></i>

                </div>
                <div className="send-button" onClick={this.onSend}>
                    <i className="tgico tgico-send"></i>
                </div>
            </div>
        </div>
    }

    mounted() {
        super.mounted();
        this.textarea = this.$el.querySelector(".textarea")
    }

    onSend(ev) {
        AppSelectedDialog.Dialog.API.sendMessage(this.textarea.textContent)
        this.textarea.innerHTML = ""
    }

    onInput(ev) {
        if(this.textarea.textContent.length > 0) {
            this.textarea.classList.remove("empty")
        } else {
            this.textarea.classList.add("empty")
        }
    }
}