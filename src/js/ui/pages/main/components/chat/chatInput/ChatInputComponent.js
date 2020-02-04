import Component from "../../../../../v/vrdom/Component";
import {ContextMenuManager} from "../../../../../contextMenuManager";
import {askForFile} from "../../../../../utils";
import Random from "../../../../../../mtproto/utils/random";
import TimeManager from "../../../../../../mtproto/timeManager";
import {createNonce} from "../../../../../../mtproto/utils/bin";
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"
import {InlineKeyboardComponent} from "../message/common/InlineKeyboardComponent";
import {formatAudioTime, convertBits} from "../../../../../utils"
import {replaceEmoji} from "../../../../../utils/emoji"
import ComposerComponent from "./ComposerComponent"
import {MessageParser} from "../../../../../../api/messages/MessageParser";
import {domToMessageEntities} from "../../../../../../mtproto/utils/htmlHelpers";

export let ChatInputManager

export class ChatInputComponent extends Component {
    constructor(props) {
        super(props);
        ChatInputManager = this
        this.state = {
            reply: null,
            attachments: []
        }
    }

    get isVoiceMode() {
        return this.textarea && this.textarea.childNodes.length === 0
    }

    h() {
        return <div className="chat-input-wrapper">
            <ComposerComponent mouseEnter={this.mouseEnterComposer} mouseLeave={this.mouseLeaveComposer} ref="composer"/>
            <div className="chat-input">

                <div className="input-and-keyboard-wrapper">
                    <div className="input-field-wrapper">
                        <div className="reply hidden">
                            <i className="tgico tgico-close btn-icon" onClick={this.closeReply}/>
                            <div className="message">
                                <img src="" className="image hidden"/>
                                <div className="reply-wrapper">
                                    <div className="title"/>
                                    <div className="description"/>
                                </div>
                            </div>
                        </div>

                        <div className="input-field">
                            <div className="another-fucking-wrapper">
                                <div className="ico-wrapper">
                                    <i className="tgico tgico-smile btn-icon rp rps"
                                       onMouseEnter={this.mouseEnterEmoji} onMouseLeave={this.mouseLeaveEmoji}/>
                                </div>
                                <div className="textarea empty"
                                     placeholder="Message"
                                     contentEditable onInput={this.onInput} onKeyPress={this.onKeyPress}
                                     onContextMenu={ContextMenuManager.listener([
                                         {
                                             title: "Bold",
                                             after: "Ctrl+B",
                                             onClick: _ => {
                                             }
                                         },
                                         {
                                             title: "Italic",
                                             after: "Ctrl+I",
                                             onClick: _ => {
                                             }
                                         },
                                         {
                                             title: "Underline",
                                             after: "Ctrl+U",
                                             onClick: _ => {
                                             }
                                         },
                                         {
                                             title: "Strikethrough",
                                             after: "Ctrl+Shift+X",
                                             onClick: _ => {
                                             }
                                         },
                                         {
                                             title: "Monospace",
                                             after: "Ctrl+Shift+M",
                                             onClick: _ => {
                                             }
                                         },
                                         {
                                             title: "Create link",
                                             after: "Ctrl+K",
                                             onClick: _ => {
                                             }
                                         },
                                         {
                                             title: "Normal text",
                                             after: "Ctrl+Shift+N",
                                             onClick: _ => {
                                             }
                                         }
                                     ])} onPaste={this.onPaste}>
                                </div>

                                <div className="ico-wrapper">

                                    <i className="tgico tgico-smallscreen btn-icon hidden"/>
                                </div>
                                <div className="ico-wrapper">

                                    <i className="tgico tgico-attach btn-icon rp rps"
                                       onClick={l => ContextMenuManager.openAbove([
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

                                <div className="voice-seconds hidden"/>

                            </div>
                        </div>

                    </div>

                            <div className="keyboard-markup">
                                {/*{this.state.keyboardMarkup.rows.map(l => {*/}
                                {/*    return <div className="row">*/}
                                {/*        {l.buttons.map(q => {*/}
                                {/*            return InlineKeyboardComponent.parseButton(null, q)*/}
                                {/*        })}*/}
                                {/*    </div>*/}
                                {/*})}*/}
                            </div>
                </div>


                <div className="round-button-wrapper">
                    <div className="round-button delete-button rp rps" onClick={this.onSend}
                         onMouseEnter={this.mouseEnterRemoveVoice} onMouseLeave={this.mouseLeaveRemoveVoice}>
                        <i className="tgico tgico-delete"/>
                    </div>

                    <div className="round-button send-button rp rps" onClick={this.onSend}
                         onMouseDown={this.onMouseDown} onContextMenu={l => ContextMenuManager.openAbove([
                        {
                            icon: "mute",
                            title: "Send without sound",
                            onClick: _ => {
                                this.send(true)
                            }
                        },
                        {
                            // TODO replace icon to calendar
                            icon: "recent",
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
        </div>
    }


    appendText(text) {
        this.textarea.innerHTML += text
        this.onInput();
    }

    initDragArea() {
        // TODO should create separate drag area!
        document.querySelector("body").addEventListener("drop", ev => {
            console.log(ev)
            for (let i = 0; i < ev.dataTransfer.items.length; i++) {
                const k = ev.dataTransfer.items[i]
                console.log(k)
                if (k.type.indexOf("image") === -1) continue
                this.state.attachments.push({
                    src: URL.createObjectURL(k.getAsFile())
                })
                this.__patch()
            }
            ev.preventDefault()
        })
        document.querySelector("body").addEventListener("dragenter", ev => {
            console.log(ev)
            ev.preventDefault()
        })
        document.querySelector("body").addEventListener("dragleave", ev => {
            console.log(ev)
            ev.preventDefault()
        })
        document.querySelector("body").addEventListener("dragover", ev => {
            // console.log(ev)
            ev.preventDefault()
        })
    }

    mouseEnterComposer() {
        this.hideComposer = false;
    }

    mouseLeaveComposer() {
        this.hideComposer = true;
        this.planComposerClose()
    }

    mouseEnterEmoji() {
        this.refs.get("composer").onShow();
        this.composer.classList.add("visible");
        this.hideComposer = false;
    }

    mouseLeaveEmoji() {
        this.hideComposer = true;
        this.planComposerClose()
    }

    planComposerClose() {
        setTimeout(() => {
            if (this.hideComposer) {
                this.composer.classList.remove("visible");
                this.refs.get("composer").onHide();
            }
        }, 250);
    }

    mouseEnterRemoveVoice() {
        this.state.isRemoveVoice = true
    }

    mouseLeaveRemoveVoice() {
        this.state.isRemoveVoice = false
    }


    onPaste(ev) {
        ev.preventDefault();

        const text = (ev.originalEvent || ev).clipboardData.getData('text/plain')

        document.execCommand("insertText", false, text)

        for (let i = 0; i < ev.clipboardData.items.length; i++) {
            const k = ev.clipboardData.items[i]
            console.log(k.toString())
            if (k.type.indexOf("image") === -1) continue
            this.state.attachments.push({
                src: URL.createObjectURL(k.getAsFile())
            })
            this.__patch()
        }
    }

    replyTo(message) {
        this.state.reply = {
            title: message.from.name,
            description: MessageParser.getPrefixNoSender(message),
            message: message,
            image: message.smallPreviewImage
        }
        this.$el.querySelector(".reply").classList.remove("hidden")
        this.$el.querySelector(".reply .message .title").innerHTML = this.state.reply.title
        this.$el.querySelector(".reply .message .description").innerHTML = this.state.reply.description
        if (this.state.reply.image !== null) {
            this.$el.querySelector(".reply .message .image").classList.remove("hidden")
            this.$el.querySelector(".reply .message .image").src = this.state.reply.image
        } else {
            this.$el.querySelector(".reply .message .image").classList.add("hidden")
        }
    }

    closeReply() {
        this.state.reply = null
        this.$el.querySelector(".reply").classList.add("hidden")
    }

    setKeyboardMarkup(markup) {
        // TODO selective
        if (markup._ === "replyKeyboardMarkup") {
            this.state.keyboardMarkup = markup
        } else if (markup._ === "replyKeyboardForceReply") {

        } else if (markup._ === "replyKeyboardHide") {
            this.state.keyboardMarkup = null
        } else {
            return
        }
        this.__patch()
    }

    pickPoll() {

    }

    pickFile(document) {
        askForFile("image/*", function (bytes, file) {
            const blob = new Blob(new Array(bytes), {type: 'application/jpeg'})

            this.state.attachments.push({
                src: URL.createObjectURL(blob)
            })
            this.__patch()
            return
            const id = [Random.nextInteger(0xffffffff), Random.nextInteger(0xffffffff)]
            AppSelectedPeer.Current.api.sendMedia("test message", bytes, {
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
        }.bind(this), true)
    }

    tickTimer() {
        const time = formatAudioTime(this.i / 100) + "," + this.i % 100;
        this.$el.querySelector(".voice-seconds").innerHTML = time
        this.i++
        if (this.isRecording)
            setTimeout(this.tickTimer, 10)
    }

    mounted() {
        super.mounted();
        this.textarea = this.$el.querySelector(".textarea")
        this.composer = this.$el.querySelector(".composer")
        this.initDragArea()
    }

    onSend(ev) {
        if (this.isVoiceMode) return
        this.send()
    }

    get isRecording() {
        return !!this.recorder
    }

    onMouseUp(ev) {
        if (!this.isVoiceMode) return

        this.recorder.stop()
        this.microphone.getTracks().forEach(function (track) {
            track.stop();
        });
        this.microphone = null
        this.recorder = null
        this.audioContext.close()
        this.audioContext = null

        this.$el.querySelector(".delete-button").classList.remove("open")
        this.$el.querySelector(".voice-seconds").classList.add("hidden")
        this.$el.querySelector(".tgico-attach").classList.remove("hidden")
        this.$el.querySelector(".voice-circle").style.transform = `scale(1)`
    }

    onRecordingReady(ev) {

        if (this.state.isRemoveVoice) {
            this.state.isRemoveVoice = false
            return
        }
        const id = TimeManager.generateMessageID(this.auth.dcID)
        var reader = new FileReader();
        reader.readAsArrayBuffer(ev.data);
        reader.onloadend = (event) => {
            // The contents of the BLOB are in reader.result:

            AppSelectedPeer.Current.api.sendMedia("", reader.result, {
                _: "inputMediaUploadedDocument",
                flags: 0,
                file: {
                    _: "inputFile",
                    id: id,
                    parts: 1,
                    name: "audio.ogg"
                },
                mime_type: "audio/ogg",
                attributes: [
                    {
                        //flags: 1024,
                        // duration: 100,
                        _: "documentAttributeAudio",
                        pFlags: {
                            voice: true,
                            waveform: this.convertBits(this.waveform, 8, 5)
                        },
                    },
                    {
                        _: "documentAttributeFilename",
                        file_name: ""
                    }
                ]
            })
        }
        console.log("onRecordingReady", ev)
    }

    onMouseDown(ev) {
        if (!this.isVoiceMode) return
        if (!this.microphone) {
            navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(l => {
                this.waveform = []
                const processInput = audioProcessingEvent => {
                    console.log(this.waveform)
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

                this.recorder.addEventListener('dataavailable', this.onRecordingReady);
                this.recorder.start()
                this.microphone = l

                document.addEventListener("mouseup", this.onMouseUp)
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

    onKeyPress(ev) {
        if ((ev.which === 13 || ev.which === 10) && !ev.shiftKey && !ev.ctrlKey) {
            this.send()
            ev.preventDefault()
        }
    }

    convertEmojiToText(ee) {
        if(ee.nodeType === Node.TEXT_NODE) return
        for(const elem of ee.childNodes) {
            if(elem.alt) {
                ee.replaceChild(document.createTextNode(elem.alt), elem)
            }
            this.convertEmojiToText(elem)
        }
    }

    send(silent = false) {
        this.convertEmojiToText(this.textarea)
        let reply = this.state.reply ? this.state.reply.message.id : null

        const {text, messageEntities} = domToMessageEntities(this.textarea)

        AppSelectedPeer.Current.api.sendMessage({text: text, messageEntities: messageEntities, replyTo: reply, silent: silent})

        this.textarea.innerHTML = ""
        this.closeReply()
        this.state.attachments = []
        this.textarea.innerHTML = ""
        this.updateSendButton()
    }

    updateSendButton() {
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

    onInput(ev) {
        this.updateSendButton();
        replaceEmoji(this.textarea);
    }
}