import Component from "../../../../../v/vrdom/Component";
import {ContextMenuManager} from "../../../../../contextMenuManager";
import {askForFile} from "../../../../../utils";
import Random from "../../../../../../mtproto/utils/random";
import TimeManager from "../../../../../../mtproto/timeManager";
import {createNonce} from "../../../../../../mtproto/utils/bin";
import AppSelectedPeer from "../../../../../reactive/SelectedPeer"
import {InlineKeyboardComponent} from "../message/common/InlineKeyboardComponent";

export let ChatInputManager

export class ChatInputComponent extends Component {
    constructor(props) {
        super(props);
        ChatInputManager = this
        this.state = {
            value: "",
            valueString: "",
            attachments: [],
            reply: null
        }
    }

    get isVoiceMode() {
        return this.state.valueString.length === 0
    }

    h() {
        return <div className="chat-input-wrapper">
            <div className="chat-input">

                <div className="input-and-keyboard-wrapper">
                    <div className="input-field-wrapper">
                        <div className={["reply", this.state.reply ? "" : "hidden"]}>
                            <i className="tgico tgico-close btn-icon" onClick={l => {
                                this.state.reply = null
                                l.target.parentElement.classList.add("hidden")
                            }
                            }/>
                            <div className="message">
                                <div className="title">{this.state.reply && this.state.reply.title}</div>
                                <div className="description">{this.state.reply && this.state.reply.description}</div>
                            </div>
                        </div>
                        <div className={["media", this.state.attachments.length > 0 ? "" : "hidden"]}>
                            {this.state.attachments && this.state.attachments.map(l => {
                                return <div className="attachment photo">
                                    <i className="tgico tgico-close" onClick={_ => {
                                        this.state.attachments = this.state.attachments.filter(e => e !== l)
                                        this.__patch()
                                    }}/>
                                    <img src={l.src} alt=""/>
                                </div>
                            })}
                        </div>
                        <div className="input-field">
                            <i className="tgico tgico-smile btn-icon rp rps"/>
                            <div className={["textarea", this.state.value.length > 0 ? "" : "empty"]}
                                 placeholder="Message"
                                 contentEditable={true} onInput={this.onInput} onKeyPress={this.onKeyPress}
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
                                 ])} dangerouslySetInnerHTML={this.state.value}>
                            </div>
                            {this.state.keyboardMarkup ?
                                // TODO replace icon to keyboard
                                <i className="tgico tgico-smallscreen btn-icon"/>
                                : ""}
                            <i className="tgico tgico-attach btn-icon rp rps"
                               onClick={l => ContextMenuManager.openAbove([
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

                    </div>

                    {
                        this.state.keyboardMarkup ?
                            <div className="keyboard-markup">
                                {this.state.keyboardMarkup.rows.map(l => {
                                    return <div className="row">
                                        {l.buttons.map(q => {
                                            return InlineKeyboardComponent.parseButton(q)
                                        })}
                                    </div>
                                })}
                            </div>
                            : ""
                    }
                </div>


                <div className="round-button delete-button rp rps" onClick={this.onSend}>
                    <i className="tgico tgico-delete_filled"/>
                </div>

                <div className="round-button-wrapper">
                    <div className="round-button send-button rp rps" onClick={this.onSend}
                         onMouseDown={this.onMouseDown}
                         onMouseUp={this.onMouseUp} onContextMenu={l => ContextMenuManager.openAbove([
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
                        <i className={["tgico", this.state.valueString.length > 0 ? "tgico-send" : "tgico-microphone"]}/>
                    </div>
                    <div className="voice-circle"/>

                </div>
            </div>
        </div>
    }

    replyTo(message) {
        this.state.reply = {
            title: message.from.name,
            description: message.text,
            message: message
        }
        this.$el.querySelector(".reply").classList.remove("hidden")
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

    mounted() {
        super.mounted();
        this.textarea = this.$el.querySelector(".textarea")
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

        console.log("MouseUp")
    }

    onRecordingReady(ev) {

        // const id = TimeManager.generateMessageID()
        // var reader = new FileReader();
        // reader.readAsArrayBuffer(ev.data);
        // reader.onloadend = (event) => {
        //     // The contents of the BLOB are in reader.result:
        //
        //     AppSelectedPeer.Current.api.sendMedia("", reader.result, {
        //         _: "inputMediaUploadedDocument",
        //         flags: 0,
        //         file: {
        //             _: "inputFile",
        //             id: id,
        //             parts: 1,
        //             name: "audio.ogg"
        //         },
        //         mime_type: "audio/ogg",
        //         attributes: [
        //             {
        //                 //flags: 1024,
        //                 // duration: 100,
        //                 _: "documentAttributeAudio",
        //                 pFlags: {
        //                     voice: true,
        //                     waveform: createNonce(63)
        //                 },
        //             },
        //             {
        //                 _: "documentAttributeFilename",
        //                 file_name: ""
        //             }
        //         ]
        //     })
        // }
        console.log("onRecordingReady", ev)
    }

    onMouseDown(ev) {
        if (!this.isVoiceMode) return
        if (!this.microphone) {
            navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(l => {

                const processInput = audioProcessingEvent => {
                    const tempArray = new Uint8Array(analyser.frequencyBinCount);

                    analyser.getByteFrequencyData(tempArray);
                    this.$el.querySelector(".voice-circle").style.transform = `scale(${getAverageVolume(tempArray)})`
                    console.log(getAverageVolume(tempArray))
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

                const audioContext = new AudioContext();
                const input = audioContext.createMediaStreamSource(l);
                const analyser = audioContext.createAnalyser();
                const scriptProcessor = audioContext.createScriptProcessor();

                // Some analyser setup
                analyser.smoothingTimeConstant = 0.3;
                analyser.fftSize = 1024;

                input.connect(analyser);
                analyser.connect(scriptProcessor);
                scriptProcessor.connect(audioContext.destination);

                scriptProcessor.onaudioprocess = processInput;

                console.log(l)
                this.recorder = new MediaRecorder(l, {
                    mimeType: "audio/webm;codecs=opus"
                });

                this.recorder.addEventListener('dataavailable', this.onRecordingReady);
                this.recorder.start()
                this.microphone = l
            })
            return
        }
        this.recorder.start()

        console.log("MouseDown")
    }

    onKeyPress(ev) {
        if (ev.which === 13 || ev.which === 10) {
            this.send()
            ev.preventDefault()
        }
    }

    send(silent = false) {
        let reply = this.state.reply ? this.state.reply.message.id : null
        AppSelectedPeer.Current.api.sendMessage(this.textarea.textContent, reply, silent)
        this.textarea.innerHTML = ""
        this.state.value = ""
        this.state.valueString = ""
        this.state.reply = null
        this.state.attachments = []
        this.__patch()
    }

    onInput(ev) {
        if (this.state.valueString.length === 0 || this.textarea.textContent.length === 0) {
            this.state.value = this.textarea.innerHTML
            this.state.valueString = this.textarea.textContent
            this.__patch()
        } else {
            this.state.value = this.textarea.innerHTML
            this.state.valueString = this.textarea.textContent
        }
        if (this.textarea.textContent.length > 0) {
            this.textarea.classList.remove("empty")
        } else {
            this.textarea.classList.add("empty")
        }
    }
}