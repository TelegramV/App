import {askForFile, convertBits, formatAudioTime} from "../../../../Utils/utils";
import AppSelectedChat from "../../../../Reactive/SelectedChat"
import ComposerComponent from "./ComposerComponent"
import SuggestionComponent from "./SuggestionComponent"
import {MessageParser} from "../../../../../Api/Messages/MessageParser";
import {domToMessageEntities} from "../../../../../Utils/htmlHelpers";
import {AttachFilesModal} from "../../../Modals/AttachFilesModal";
import {AttachPollModal} from "../../../Modals/AttachPollModal";
import {TextareaFragment} from "./TextareaFragment";
import {AttachPhotosModal} from "../../../Modals/AttachPhotosModal";
import UIEvents from "../../../../EventBus/UIEvents";
import VComponent from "../../../../../V/VRDOM/component/VComponent";
import MTProto from "../../../../../MTProto/External"
import VUI from "../../../../VUI"
import VApp from "../../../../../V/vapp"
import ChatToBottomButtonComponent from "../ChatToBottomButtonComponent"
import StatelessComponent from "../../../../../V/VRDOM/component/StatelessComponent"
import {SearchSidebar} from "../../../SidebarsNeo/Right/Search/SearchSidebar";
import {isMobile} from "../../../../Utils/utils"

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

    get isRecording() {
        return !!this.recorder
    }

    appEvents(E: AE) {
        E.bus(UIEvents.General)
            .on("search.open", this.onSearchOpened)
            .on("search.close", this.onSearchClosed)
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
                                <div className="another-fucking-wrapper">
                                    <div className="ico-wrapper">
                                        <i className="tgico tgico-smile btn-icon rp rps"
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
                                           onClick={
                                               l => VUI.ContextMenu.openAbove([
                                                   {
                                                       icon: "poll",
                                                       title: "Poll",
                                                       onClick: _ => {
                                                           this.pickPoll()
                                                       }
                                                   },
                                                   {
                                                       icon: "photo",
                                                       title: "Photo or Video",
                                                       onClick: this.attachPhoto
                                                   },
                                                   {
                                                       icon: "document",
                                                       title: "Document",
                                                       onClick: this.attachFile
                                                   },
                                               ], l.target)
                                           }/>
                                    </div>

                                    <div className="voice-seconds hidden"/>

                                </div>
                            </div>
                        </div>

                        <div className="round-button-wrapper">
                            <ChatToBottomButtonComponent/>

                            <div className="round-button delete-button rp rps" onClick={l => this.onSend(l)}
                                 onMouseEnter={l => this.mouseEnterRemoveVoice(l)}
                                 onMouseLeave={l => this.mouseLeaveRemoveVoice(l)}>
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

    onKeyDown = (event: Event) => {
        const code = event.keyCode || event.which;

        if (code === 27) {
            if (this.reply) {
                event.stopPropagation();

                this.closeReply();
            }
        }
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
        if (window.getSelection) {
            sel = window.getSelection();
            if ((sel.baseNode?.parentElement === this.textarea || sel.baseNode === this.textarea)
                && sel.getRangeAt && sel.rangeCount) {
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
                this.pickPhoto(URL.createObjectURL(k.getAsFile()))
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
        if(isMobile()) return;
        VApp.mountedComponents.get("composer").show();
        this.hideComposer = false;
    }

    mouseLeaveEmoji = () => {
        if(isMobile()) return;
        this.hideComposer = true;
        this.planComposerClose()
    }

    mouseClickEmoji = (ev) => {
        let composer = VApp.mountedComponents.get("composer");
        if (composer.visible && this.composerClicked) {
            this.composerClicked = false;
            composer.hide();
            if(isMobile()) {
                ev.currentTarget.classList.add("tgico-smile");
                ev.currentTarget.classList.remove("tgico-keyboard");
            }
        } else {
            this.composerClicked=true;
            composer.show();
            if(isMobile()) {
                ev.currentTarget.classList.remove("tgico-smile");
                ev.currentTarget.classList.add("tgico-keyboard");
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

    mouseEnterRemoveVoice = () => {
        this.isRemoveVoice = true
    }

    mouseLeaveRemoveVoice = () => {
        this.isRemoveVoice = false
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
            UIEvents.General.fire("chat.showMessage", {message: this.reply.message})
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

    pickPhoto = (blob) => {
        // TODO wtf?
        // if (VUI.Modal.$el.querySelector(".dialog").childNodes[0].__component instanceof AttachPhotosModal) {
        //     VUI.Modal.$el.querySelector(".dialog").childNodes[0].__component.addPhoto(blob)
        //     return
        // }
        VUI.Modal.open(<AttachPhotosModal media={[blob]}/>)
    }

    pickFile = (blob, file) => {
        // TODO wtf?
        // if (VUI.Modal.$el.querySelector(".dialog").childNodes[0].__component instanceof AttachFilesModal) {
        //     VUI.Modal.$el.querySelector(".dialog").childNodes[0].__component.addFile(blob, file)
        //     return
        // }
        VUI.Modal.open(<AttachFilesModal media={[{
            blob: blob,
            file: file
        }]}/>)
    }

    attachFile = () => {
        askForFile("", (bytes, file) => {
            const blob = new Blob(new Array(bytes), {type: 'application/jpeg'})

            this.pickFile(URL.createObjectURL(blob), file)
        }, true, true)
    }

    attachPhoto = () => {
        askForFile("image/*,video/*", (bytes, file) => {
            const blob = new Blob(new Array(bytes), {type: 'application/jpeg'})

            this.pickPhoto(URL.createObjectURL(blob))
        }, true, true)
    }

    tickTimer = () => {
        const time = formatAudioTime(this.i / 100) + "," + this.i % 100;
        this.$el.querySelector(".voice-seconds").innerHTML = time
        this.i++
        if (this.isRecording)
            this.withTimeout(l => this.tickTimer(), 10)
    }

    onSend = (ev) => {
        if (this.isVoiceMode) return
        this.send()
    }

    onMouseUp = (ev) => {
        if (!this.isVoiceMode) return

        this.$el.querySelector(".delete-button").classList.remove("open")
        this.$el.querySelector(".voice-seconds").classList.add("hidden")
        this.$el.querySelector(".tgico-attach").classList.remove("hidden")
        this.$el.querySelector(".voice-circle").style.transform = `scale(1)`

        this.recorder.stop()
        this.microphone.getTracks().forEach(function (track) {
            track.stop();
        });
        this.microphone = null
        this.recorder = null
        this.audioContext.close()
        this.audioContext = null

    }

    onRecordingReady = (ev) => {

        if (this.isRemoveVoice) {
            this.isRemoveVoice = false
            return
        }
        // TODO refactor sending
        MTProto.TimeManager.generateMessageId().then(id => {
            let reader = new FileReader();
            reader.readAsArrayBuffer(ev.data);
            reader.onloadend = (event) => {
                // The contents of the BLOB are in reader.result:

                AppSelectedChat.Current.api.sendMedia("", reader.result, {
                    _: "inputMediaUploadedDocument",
                    file: {
                        _: "inputFile",
                        id: id,
                        parts: 1,
                        name: "audio.ogg"
                    },
                    mime_type: "audio/ogg",
                    attributes: [{
                        //flags: 1024,
                        // duration: 100,
                        _: "documentAttributeAudio",
                        voice: true,
                        waveform: convertBits(this.waveform, 8, 5)
                    },
                        {
                            _: "documentAttributeFilename",
                            file_name: ""
                        }
                    ]
                })
            }
            console.log("onRecordingReady", ev)
        })
    }

    onMouseDown = (ev) => {
        if (!this.isVoiceMode) return
        if (!this.microphone) {
            navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(l => {
                this.waveform = []
                const processInput = audioProcessingEvent => {
                    // console.log(this.waveform)
                    const tempArray = new Uint8Array(analyser.frequencyBinCount);

                    analyser.getByteFrequencyData(tempArray);
                    this.$el.querySelector(".voice-circle").style.transform = `scale(${Math.min(getAverageVolume(tempArray) / 255 * 25 + 1, 4)})`
                    this.waveform.push(Math.floor(getAverageVolume(tempArray) / 255 * 32))
                }

                const getAverageVolume = array => {
                    const length = array.length;
                    let values = 0;
                    let i = 0;

                    for (; i < length; i++) {
                        values += array[i];
                    }

                    return values / length;
                }

                this.audioContext = new AudioContext();
                const input = this.audioContext.createMediaStreamSource(l);
                const analyser = this.audioContext.createAnalyser();
                const scriptProcessor = this.audioContext.createScriptProcessor();

                // Some analyser setup
                analyser.smoothingTimeConstant = 0.3;
                analyser.fftSize = 1024;

                input.connect(analyser);
                analyser.connect(scriptProcessor);
                scriptProcessor.connect(this.audioContext.destination);

                scriptProcessor.onaudioprocess = processInput;

                console.log(l)
                this.recorder = new MediaRecorder(l, {
                    mimeType: "audio/webm;codecs=opus"
                });

                this.recorder.addEventListener('dataavailable', l => this.onRecordingReady(l));
                this.recorder.start()
                this.microphone = l

                document.addEventListener("mouseup", l => this.onMouseUp(l))
                this.$el.querySelector(".delete-button").classList.add("open")
                this.$el.querySelector(".voice-seconds").classList.remove("hidden")
                this.$el.querySelector(".tgico-attach").classList.add("hidden")

                this.i = 0
                this.tickTimer()

            })
            return
        }
        console.error("MouseDown")
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

        const {text, messageEntities} = domToMessageEntities(this.textarea)

        AppSelectedChat.Current.api.sendMessage({
            text: text,
            messageEntities: messageEntities,
            replyTo: reply,
            silent: silent
        })

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