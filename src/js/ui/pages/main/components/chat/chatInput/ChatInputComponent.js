import Component from "../../../../../v/vrdom/Component";
import {ContextMenuManager} from "../../../../../contextMenuManager";
import {askForFile, convertBits, formatAudioTime} from "../../../../../utils";
import Random from "../../../../../../mtproto/utils/random";
import TimeManager from "../../../../../../mtproto/timeManager";
import {createNonce} from "../../../../../../mtproto/utils/bin";
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"
import {InlineKeyboardComponent} from "../message/common/InlineKeyboardComponent";
import {replaceEmoji} from "../../../../../utils/emoji"
import ComposerComponent from "./ComposerComponent"
import {MessageParser} from "../../../../../../api/messages/MessageParser";
import {domToMessageEntities} from "../../../../../../mtproto/utils/htmlHelpers";
import {ModalManager} from "../../../../../modalManager";
import {AttachFilesModal} from "../../../modals/AttachFilesModal";
import {AttachPollModal} from "../../../modals/AttachPollModal";
import {TextareaFragment} from "./TextareaFragment";
import {AttachPhotosModal} from "../../../modals/AttachPhotosModal";
import UIEvents from "../../../../../eventBus/UIEvents";
import VComponent from "../../../../../v/vrdom/component/VComponent";
import VF from "../../../../../v/VFramework";
import AppConfiguration from "../../../../../../configuration";

export let ChatInputManager

export class ChatInputComponent extends VComponent {
    chatInputTextareaRef = VComponent.createComponentRef()

    constructor(props) {
        super(props);
        ChatInputManager = this
        this.reply = null
    }

    h() {
        return <div className="chat-input-wrapper">
            <div className="chat-input">
            <ComposerComponent mouseEnter={this.mouseEnterComposer.bind(this)} mouseLeave={this.mouseLeaveComposer.bind(this)}/>
                <div className="input-and-keyboard-wrapper">
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
                                       onMouseEnter={this.mouseEnterEmoji.bind(this)} onMouseLeave={this.mouseLeaveEmoji.bind(this)}/>
                                </div>
                                <TextareaFragment ref={this.chatInputTextareaRef} parent={this} />

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
                                               onClick: this.attachPhoto
                                           },
                                           {
                                               icon: "document",
                                               title: "Document",
                                               onClick: this.attachFile
                                           },
                                       ], l.target)}/>
                                </div>

                                <div className="voice-seconds hidden"/>

                            </div>
                        </div>

                    </div>

                            <div className="keyboard-markup">
                                {/*{this.keyboardMarkup.rows.map(l => {*/}
                                {/*    return <div className="row">*/}
                                {/*        {l.buttons.map(q => {*/}
                                {/*            return InlineKeyboardComponent.parseButton(null, q)*/}
                                {/*        })}*/}
                                {/*    </div>*/}
                                {/*})}*/}
                            </div>
                </div>


                <div className="round-button-wrapper">
                    <div className="round-button delete-button rp rps" onClick={l => this.onSend(l)}
                         onMouseEnter={l => this.mouseEnterRemoveVoice(l)} onMouseLeave={l => this.mouseLeaveRemoveVoice(l)}>
                        <i className="tgico tgico-delete"/>
                    </div>

                    <div className="round-button send-button rp rps" onClick={l => this.onSend(l)}
                         onMouseDown={l => this.onMouseDown(l)} onContextMenu={l => ContextMenuManager.openAbove([
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
        this.chatInputTextareaRef.component.onInput();
    }

    get isVoiceMode() {
        return this.textarea && this.textarea.childNodes.length === 0
    }

    initDragArea() {
        // TODO should create separate drag area!
        document.querySelector("body").addEventListener("drop", ev => {
            for (let i = 0; i < ev.dataTransfer.items.length; i++) {
                const k = ev.dataTransfer.items[i]
                console.log(k)
                if (k.type.indexOf("image") === -1) continue
                this.pickPhoto(URL.createObjectURL(k.getAsFile()))
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
        VF.mountedComponents.get("composer").onShow();
        VF.mountedComponents.get("composer").$el.classList.add("visible");
        this.hideComposer = false;
    }

    mouseLeaveEmoji() {
        this.hideComposer = true;
        this.planComposerClose()
    }

    planComposerClose() {
        this.withTimeout(() => {
            if (this.hideComposer) {
                VF.mountedComponents.get("composer").$el.classList.remove("visible");
                VF.mountedComponents.get("composer").onHide();
            }
        }, 250);
    }

    mouseEnterRemoveVoice() {
        this.isRemoveVoice = true
    }

    mouseLeaveRemoveVoice() {
        this.isRemoveVoice = false
    }

    hide() {
        this.$el.style.display = "none"
    }

    show() {
        this.$el.style.display = "block"
    }

    clear() {
        this.closeReply()
        this.textarea.focus()
        this.chatInputTextareaRef.component.clearInput()
    }

    navigateToReplied() {
        if(this.reply) {
            UIEvents.Bubbles.fire("showMessage", this.reply.message)
        }
    }

    replyTo(message) {
        this.reply = {
            title: message.from.name,
            description: MessageParser.getPrefixNoSender(message),
            message: message,
            image: message.smallPreviewImage
        }
        this.$el.querySelector(".reply").classList.remove("hidden")
        this.$el.querySelector(".reply .message .title").innerHTML = this.reply.title
        this.$el.querySelector(".reply .message .description").innerHTML = this.reply.description
        if (this.reply.image !== null) {
            this.$el.querySelector(".reply .message .image").classList.remove("hidden")
            this.$el.querySelector(".reply .message .image").src = this.reply.image
        } else {
            this.$el.querySelector(".reply .message .image").classList.add("hidden")
        }
        this.textarea.focus()
    }

    closeReply() {
        this.reply = null
        this.$el.querySelector(".reply").classList.add("hidden")
    }

    setKeyboardMarkup(markup) {
        // TODO selective
        if (markup._ === "replyKeyboardMarkup") {
            this.keyboardMarkup = markup
        } else if (markup._ === "replyKeyboardForceReply") {

        } else if (markup._ === "replyKeyboardHide") {
            this.keyboardMarkup = null
        } else {
            return
        }
        this.__patch()
    }

    pickPoll() {
        ModalManager.open(<AttachPollModal/>)
    }

    pickPhoto(blob) {
        // TODO wtf?
        if(ModalManager.$el.querySelector(".dialog").childNodes[0].__component instanceof AttachPhotosModal) {
            ModalManager.$el.querySelector(".dialog").childNodes[0].__component.addPhoto(blob)
            return
        }
        ModalManager.open(<AttachPhotosModal media={[blob]}/>)
    }

    pickFile(blob, file) {
        // TODO wtf?
        if(ModalManager.$el.querySelector(".dialog").childNodes[0].__component instanceof AttachFilesModal) {
            ModalManager.$el.querySelector(".dialog").childNodes[0].__component.addFile(blob, file)
            return
        }
        ModalManager.open(<AttachFilesModal media={[{
            blob: blob,
            file: file
        }]}/>)
    }

    attachFile() {
        askForFile("", function (bytes, file) {
            const blob = new Blob(new Array(bytes), {type: 'application/jpeg'})

            this.pickFile(URL.createObjectURL(blob), file)
        }.bind(this), true, true)
    }

    attachPhoto() {
        askForFile("image/*,video/*", function (bytes, file) {
            const blob = new Blob(new Array(bytes), {type: 'application/jpeg'})

            this.pickPhoto(URL.createObjectURL(blob))
        }.bind(this), true, true)
    }

    tickTimer() {
        const time = formatAudioTime(this.i / 100) + "," + this.i % 100;
        this.$el.querySelector(".voice-seconds").innerHTML = time
        this.i++
        if (this.isRecording)
            this.withTimeout(l => this.tickTimer(), 10)
    }

    mounted() {
        super.mounted();
        this.textarea = this.$el.querySelector(".textarea")
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

    onRecordingReady(ev) {

        if (this.isRemoveVoice) {
            this.isRemoveVoice = false
            return
        }
        // TODO refactor sending
        const id = TimeManager.generateMessageID(AppConfiguration.mtproto.dataCenter.default)
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
                            waveform: convertBits(this.waveform, 8, 5)
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
        let reply = this.reply ? this.reply.message.id : null

        const {text, messageEntities} = domToMessageEntities(this.textarea)

        AppSelectedPeer.Current.api.sendMessage({text: text, messageEntities: messageEntities, replyTo: reply, silent: silent})

        this.textarea.innerHTML = ""
        this.closeReply()
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

}