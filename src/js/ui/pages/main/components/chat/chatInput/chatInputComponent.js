import Component from "../../../../../framework/vrdom/component";
import AppSelectedDialog from "../../../../../../api/dialogs/selectedDialog";
import {ContextMenuManager} from "../../../../../contextMenuManager";
import MTProto from "../../../../../../mtproto";
import {AppFramework} from "../../../../../framework/framework";
import {askForFile} from "../../../../../utils";
import Random from "../../../../../../mtproto/utils/random";

export class ChatInputComponent extends Component {
    h() {
        return <div className="chat-input-wrapper">
            <div className="chat-input">

                <div className="input-field">
                    <i className="tgico tgico-smile"></i>
                    <div className="textarea empty" placeholder="Message" contentEditable onInput={this.onInput}/>
                    <i className="tgico tgico-attach" onClick={l => ContextMenuManager.openAbove([
                        {
                            icon: "photo",
                            title: "Photo or Video",
                            onClick: _ => {
                                this.pickFile(false)
                            }
                        },
                        {
                            icon: "document",
                            title: "Document",
                            onClick: _ => {
                                this.pickFile(true)
                            }
                        },
                    ], l.target)}/>

                </div>
                <div className="send-button" onClick={this.onSend}>
                    <i className="tgico tgico-send"></i>
                </div>
            </div>
        </div>
    }

    pickFile(document) {
        askForFile("image/*", function(bytes, file) {
            const id = [Random.nextInteger(0xffffffff), Random.nextInteger(0xffffffff)]
            AppSelectedDialog.Dialog.API.sendMedia("test message", bytes, {
                _: document ? "inputMediaUploadedDocument" : "inputMediaUploadedPhoto",
                flags: 0,
                file: {
                    _: "inputFile",
                    id: id,
                    parts: 1,
                    name: file.name
                },
                mime_type: "octec/stream",
                attributes: [
                    {
                        _: "documentAttributeFilename",
                        file_name: file.name
                    }
                ]
            })
        }, true)
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