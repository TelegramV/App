import { askForFile, convertBits } from "../../../../Utils/utils";
import { formatTime } from "../../../../../Utils/date"
import { IS_MOBILE_SCREEN, IS_VOICE_RECORDING_SUPPORTED } from "../../../../../Utils/browser"
import AppSelectedChat from "../../../../Reactive/SelectedChat"
import ComposerComponent from "./ComposerComponent"
import SuggestionComponent from "./SuggestionComponent"
import { MessageParser } from "../../../../../Api/Messages/MessageParser";
import { domToMessageEntities } from "../../../../../Utils/htmlHelpers";
import { AttachFilesModal } from "../../../Modals/AttachFilesModal";
import { AttachPollModal } from "../../../Modals/AttachPollModal";
import { TextareaFragment } from "./TextareaFragment";
import { AttachPhotosModal } from "../../../Modals/AttachPhotosModal";
import UIEvents from "../../../../EventBus/UIEvents";
import VComponent from "../../../../../V/VRDOM/component/VComponent";
import MTProto from "../../../../../MTProto/External"
import VUI from "../../../../VUI"
import VApp from "../../../../../V/vapp"
import ChatToBottomButtonComponent from "../ChatToBottomButtonComponent"
import StatelessComponent from "../../../../../V/VRDOM/component/StatelessComponent"
import { UserPeer } from "../../../../../Api/Peers/Objects/UserPeer";
import Settings from "../../../../../Api/Settings/Settings";
import * as voiceRecorder from "../../../../../Utils/voiceRecorder"

export let ChatInputManager

export class ChatInputComponent extends StatelessComponent {
    chatInputTextareaRef = VComponent.createComponentRef()

    identifier = `chat-input`

    constructor(props) {
        super(props);
        ChatInputManager = this
        this.reply = null
    }

    get isVoiceMode() {
        return this.textarea && this.textarea.childNodes.length === 0
    }

    appEvents(E: AE) {
        E.bus(UIEvents.General)
            .on("search.open", this.onSearchOpened)
            .on("search.close", this.onSearchClosed)
            .on("chat.select", this.onChatSelect)
    }

    render() {
        return <div className="chat-input-wrapper">
            <div className="chat-input">
                <SuggestionComponent/>
                <div class="input-column">
                    <div class="input-row">
                        <div className="input-field-wrapper">
                            <div className="reply hidden">
                                <i className="tgico tgico-close btn-icon" onClick={this.closeReply.bind(this)}/>
                                <div className="message" onClick={this.navigateToReplied.bind(this)}>
                                    <img src="" className="image hidden"/>
                                    <div className="reply-wrapper">
                                        <div className="title"/>
                                        <div className="description"/>
                                    </div>
                                </div>
                            </div>

                            <div className="field">
                                <div className="another-wrapper">
                                    <div className="ico-wrapper">
                                        <i className="tgico tgico-smile btn-icon rp rps composer-button"
                                           onMouseEnter={this.mouseEnterEmoji.bind(this)}
                                           onMouseLeave={this.mouseLeaveEmoji.bind(this)}
                                           onClick={this.mouseClickEmoji.bind(this)}/>
                                    </div>
                                    <TextareaFragment ref={this.chatInputTextareaRef} parent={this}/>

                                    <div className="ico-wrapper">

                                        <i className="tgico tgico-smallscreen btn-icon hidden"/>
                                    </div>
                                    <div className="ico-wrapper">

                                        <i className="tgico tgico-attach btn-icon rp rps"
                                           onClick={this.openAttachContext}/>
                                    </div>

                                    <div className="voice-seconds hidden"/>

                                </div>
                            </div>
                        </div>

                        <div className="round-button-wrapper">
                            <ChatToBottomButtonComponent/>

                            <div className="round-button delete-button rp rps" onClick={this.cancelVoiceRecording.bind(this)}>
                                <i className="tgico tgico-delete"/>
                            </div>

                            <div className="round-button send-button rp rps" onClick={l => this.onSend(l)}
                                 onMouseDown={l => this.onMouseDown(l)} onContextMenu={l => VUI.ContextMenu.openAbove([
                                {
                                    icon: "mute",
                                    title: "Send without sound",
                                    onClick: _ => {
                                        this.send(true)
                                    }
                                },
                                {
                                    icon: "calendar",
                                    title: "Schedule message",
                                    onClick: _ => {
                                    }
                                },
                            ], l.target)}>
                                <i className="tgico tgico-send hidden"/>
                                <i className="tgico tgico-microphone2"/>
                            </div>
                            <div className="voice-circle"/>

                        </div>
                    </div>
                    <ComposerComponent mouseEnter={this.mouseEnterComposer.bind(this)}
                                       mouseLeave={this.mouseLeaveComposer.bind(this)}/>
                </div>
            </div>
        </div>
    }

    componentDidMount() {
        this.textarea = this.$el.querySelector(".textarea")
        this.initDragArea()
        window.addEventListener("keydown", this.onKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.onKeyDown);
    }

    onSearchOpened = () => {
        this.$el.style.opacity = "0"
    }

    onSearchClosed = () => {
        this.$el.style.opacity = "1"
    }

    /**
     * @param {Peer} peer
     */
    onChatSelect = ({ peer }) => {
        if (peer?.canSendMessage ?? true) {
            this.show()
        } else {
            this.hide()
        }
    }

    onKeyDown = (event: Event) => {
        const code = event.keyCode || event.which;

        if (code === 27) {
            if (this.reply) {
                event.stopPropagation();

                this.closeReply();
            }
        }
    }

    openAttachContext = (event) => {
        const items = [

            {
                icon: "photo",
                title: "Photo or Video",
                onClick: this.attachMedia
            },
            {
                icon: "document",
                title: "Document",
                onClick: this.attachFile
            },
        ]
        if (!(AppSelectedChat.current instanceof UserPeer)) {
            items.push({
                icon: "poll",
                title: "Poll",
                onClick: _ => {
                    this.pickPoll()
                }
            })
        }
        VUI.ContextMenu.openAbove(items, event.target)
    }

    appendText = (text) => {
        this.textarea.textContent = this.text + text;
        this.chatInputTextareaRef.component.onInput();
    }

    insertAtCaret = (text) => {
        let sel, range;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.baseNode?.parentElement === this.textarea && sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(text));
            } else { //no selection inside our input
                this.appendText(text);
            }
        }
        this.chatInputTextareaRef.component.onInput();
    }

    backspace = () => { //BUGGY!!!, REWRITE THIS
        let sel, range;
        this.setEndOfContenteditable(this.textarea)
        if (window.getSelection) {
            sel = window.getSelection();
            if ((sel.baseNode?.parentElement === this.textarea || sel.baseNode === this.textarea) &&
                sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                if (range.collapsed) { //no selection
                    if (range.startOffset > 0) {
                        let nr = new Range();
                        nr.setStart(range.startContainer, range.startOffset - 1);
                        nr.setEnd(range.endContainer, range.endOffset);
                        range = nr;
                    }
                }
                //console.log(range);
                range.deleteContents();
            }
        }
        this.chatInputTextareaRef.component.onInput();
    }

    initDragArea = () => {
        // TODO should create separate drag area!
        document.querySelector("body").addEventListener("drop", ev => {
            for (let i = 0; i < ev.dataTransfer.items.length; i++) {
                const k = ev.dataTransfer.items[i]
                // console.log(k)
                if (k.type.indexOf("image") === -1) continue
                this.pickMedia(k.getAsFile())
            }
            ev.preventDefault()
        })
        document.querySelector("body").addEventListener("dragenter", ev => {
            // console.log(ev)
            ev.preventDefault()
        })
        document.querySelector("body").addEventListener("dragleave", ev => {
            // console.log(ev)
            ev.preventDefault()
        })
        document.querySelector("body").addEventListener("dragover", ev => {
            // console.log(ev)
            ev.preventDefault()
        })
    }

    mouseEnterComposer = () => {
        this.hideComposer = false;
    }

    mouseLeaveComposer = () => {
        this.hideComposer = true;
        this.planComposerClose()
    }

    mouseEnterEmoji = () => {
        if (IS_MOBILE_SCREEN) return;
        VApp.mountedComponents.get("composer").show();
        this.hideComposer = false;
    }

    mouseLeaveEmoji = () => {
        if (IS_MOBILE_SCREEN) return;
        this.hideComposer = true;
        this.planComposerClose()
    }

    mouseClickEmoji = (ev) => {
        let composer = VApp.mountedComponents.get("composer");
        if (composer.visible && this.composerClicked) {
            this.composerClicked = false;
            composer.hide();
            this.updateEmojiButton();
        } else {
            this.composerClicked = true;
            composer.show();
            this.updateEmojiButton();
        }
    }

    updateEmojiButton = () => {
        let composer = VApp.mountedComponents.get("composer");
        let button = this.$el.querySelector(".composer-button");
        if (IS_MOBILE_SCREEN) {
            if (composer.visible) {
                button.classList.remove("tgico-smile");
                button.classList.add("tgico-keyboard");
            } else {
                button.classList.add("tgico-smile");
                button.classList.remove("tgico-keyboard");
            }
        }
    }

    planComposerClose = () => {
        this.withTimeout(() => {
            if (this.hideComposer && !this.composerClicked) {
                VApp.mountedComponents.get("composer").hide();
            }
        }, 250);
    }

    hide = () => {
        this.$el.style.display = "none"
    }

    show = () => {
        this.$el.style.display = "block"
    }

    clear = () => {
        this.closeReply()
        this.focus()
        this.chatInputTextareaRef.component.clearInput()
    }

    navigateToReplied = () => {
        if (this.reply) {
            UIEvents.General.fire("chat.showMessage", { message: this.reply.message })
        }
    }

    replyTo = (message) => {
        this.reply = {
            title: message.from.name,
            description: MessageParser.getPrefixNoSender(message),
            message: message,
            image: message.srcUrl
        }
        this.$el.querySelector(".reply").classList.remove("hidden")
        this.$el.querySelector(".reply .message .title").innerHTML = this.reply.title
        this.$el.querySelector(".reply .message .description").innerHTML = this.reply.description
        if (this.reply.image) {
            this.$el.querySelector(".reply .message .image").classList.remove("hidden")
            this.$el.querySelector(".reply .message .image").src = this.reply.image
        } else {
            this.$el.querySelector(".reply .message .image").classList.add("hidden")
        }
        this.focus()
    }

    closeReply = () => {
        this.reply = null
        this.$el.querySelector(".reply").classList.add("hidden")
    }

    setKeyboardMarkup = (markup) => {
        // TODO selective
        if (markup._ === "replyKeyboardMarkup") {
            this.keyboardMarkup = markup
        } else if (markup._ === "replyKeyboardForceReply") {

        } else if (markup._ === "replyKeyboardHide") {
            this.keyboardMarkup = null
        } else {

        }
        // this.forceUpdate()
    }

    pickPoll = () => {
        VUI.Modal.open(<AttachPollModal/>)
    }

    pickMedia = (blob) => {
        if (VUI.Modal.state.body.componentClass !== AttachPhotosModal) {
            VUI.Modal.open(<AttachPhotosModal media={[blob]}/>)
        } else {
            UIEvents.General.fire("upload.addMedia", { blob: blob })
        }
    }

    pickFile = (blob, file) => {
        if (VUI.Modal.state.body.componentClass !== AttachFilesModal) {
            VUI.Modal.open(<AttachFilesModal media={[{
                blob: blob,
                file: file
            }]}/>)
        } else {
            UIEvents.General.fire("upload.addFile", { blob: blob, file: file })
        }
    }

    attachFile = () => {
        askForFile("", (bytes, file) => {
            const blob = new Blob(new Array(bytes), { type: file.type })

            this.pickFile(blob, file)
        }, true, true)
    }

    attachMedia = () => {
        askForFile("image/*,video/*", (bytes, file) => {
            const blob = new Blob(new Array(bytes), { type: file.type })

            this.pickMedia(blob)
        }, true, true)
    }

    updateTimer = () => {
        const now = Date.now();
        const diff = now - this.recordingStarted;
        const time = formatTime(diff/1000) + "," + diff % 1000;
        this.$el.querySelector(".voice-seconds").innerHTML = time
    }

    onSend = (ev) => {
        if(!this.isVoiceMode){
            this.send()
        }
    }

    cancelVoiceRecording = (ev) => {
        this.isRemoveVoice = true;        
        this.stopRecording();
    }

    sendVoice = ({blob, duration, waveform}) => {
        if(this.isRemoveVoice) {
            this.isRemoveVoice = false;
            return;
        }
        AppSelectedChat.Current.api.sendVoice(blob, duration, waveform)
    }

    stopRecording = () => {
        this.$el.querySelector(".delete-button").classList.remove("open")
        this.$el.querySelector(".voice-seconds").classList.add("hidden")
        this.$el.querySelector(".tgico-attach").classList.remove("hidden")
        this.$el.querySelector(".voice-circle").style.transform = `scale(1)`

        this.$el.querySelector(".send-button>.tgico-send").classList.add("hidden")
        this.$el.querySelector(".send-button>.tgico-microphone2").classList.remove("hidden")
        this.isRecording = false;
        this.recorderStop().then(this.sendVoice)
    }

    onMouseDown = async (ev) => {
        if(!this.isVoiceMode) return;
        if(!IS_VOICE_RECORDING_SUPPORTED) {
            UIEvents.General.fire("snackbar.show", {
                text: "Voice recording is not supported in your browser!",
                time: 5
            })
            return;
        }
        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.$el.querySelector(".send-button>.tgico-send").classList.remove("hidden")
            this.$el.querySelector(".send-button>.tgico-microphone2").classList.add("hidden")
            this.recorderStop = await voiceRecorder.start((volume) => {
                this.$el.querySelector(".voice-circle").style.transform = `scale(${Math.min((volume-128)/7, 4)})`
                this.updateTimer();
            })
            this.recordingStarted = Date.now()
            this.isRecording = true

            const statusTimer = this.withInterval(() => {
                    if(!this.isRecording) {
                        this.clearInterval(statusTimer)
                        return;
                    }

                    AppSelectedChat.Current.api.sendMessageAction({
                        _: "sendMessageRecordAudioAction"
                    })
                }, 1000)


            this.$el.querySelector(".delete-button").classList.add("open")
            this.$el.querySelector(".voice-seconds").classList.remove("hidden")
            this.$el.querySelector(".tgico-attach").classList.add("hidden")
        }
    }


    convertEmojiToText = (ee) => {
        if (ee.nodeType === Node.TEXT_NODE) return
        for (const elem of ee.childNodes) {
            if (elem.alt) {
                ee.replaceChild(document.createTextNode(elem.alt), elem)
            }
            this.convertEmojiToText(elem)
        }
    }

    nodeText = (node) => {
        let text = "";
        for (const elem of node.childNodes) {
            if (elem.nodeType === Node.TEXT_NODE) {
                text += elem.textContent;
            } else {
                if (elem.alt) {
                    text += elem.alt;
                } else {
                    text += this.nodeText(elem)
                }
            }
        }
        return text;
    }

    get text() {
        return this.nodeText(this.textarea);
    }

    send = (silent = false) => {
        this.convertEmojiToText(this.textarea)
        let reply = this.reply ? this.reply.message.id : null

        const { text, messageEntities } = domToMessageEntities(this.textarea)

        if (Settings.get("app_config.emojies_send_dice")?.includes(text) || text === "🎰") {
            AppSelectedChat.Current.api.sendDice(text);
        } else {
            AppSelectedChat.Current.api.sendMessage({
                text: text,
                messageEntities: messageEntities,
                replyTo: reply,
                silent: silent
            })
        }

        this.textarea.innerHTML = ""
        this.closeReply()
        this.textarea.innerHTML = ""
        this.updateSendButton()

        this.chatInputTextareaRef.component.onInput(); //trigger to close suggestion
    }

    focus = () => {
        this.textarea.focus();
        this.setEndOfContenteditable(this.textarea);
    }

    setEndOfContenteditable = (contentEditableElement) => {
        let range, selection;
        range = document.createRange();
        range.selectNodeContents(contentEditableElement);
        range.collapse(false);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    updateSendButton = () => {
        if (this.textarea.childNodes.length === 0) {
            this.$el.querySelector(".send-button>.tgico-send").classList.add("hidden")
            this.$el.querySelector(".send-button>.tgico-microphone2").classList.remove("hidden")
        } else {
            this.$el.querySelector(".send-button>.tgico-send").classList.remove("hidden")
            this.$el.querySelector(".send-button>.tgico-microphone2").classList.add("hidden")
        }

        if (this.textarea.childNodes.length > 0) {
            this.textarea.classList.remove("empty")
        } else {
            this.textarea.classList.add("empty")
        }
    }

}