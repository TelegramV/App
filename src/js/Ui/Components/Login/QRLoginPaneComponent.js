import PaneComponent from "./PaneComponent"
import InfoComponent from "./InfoComponent"

import AppConfiguration from "../../../Config";
import {MTProto} from "../../../MTProto/external"

const QRCodeStyling = require("qr-code-styling")

export default class QRLoginPaneComponent extends PaneComponent {
    constructor(props) {
        super(props);
        MTProto.UpdatesManager.subscribe("updateLoginToken", l => {
            if (l._ === "auth.loginTokenSuccess") {
                this.props.finished(l.authorization)
                return
            }
            this.requestLoginToken().then(q => {
                if (q._ === "auth.loginTokenSuccess") {
                    this.props.finished(q.authorization)
                    return
                }
            })
            /*MTProto.invokeMethod("auth.exportLoginToken", {
                api_id: AppConfiguration.mtproto.api.api_id,
                api_hash: AppConfiguration.mtproto.api.api_hash,
                except_ids: []
            }).then(l => {
                this.open(l)
            })*/
        })
    }

    render() {
        let classList = ["fading-block"]
        if (this.state.isShown === true) {
            classList.push("fade-in");
        } else if (this.state.isShown === false) {
            classList.push("fade-out");
        } else {
            classList.push("hidden");
        }
        return (
            <div className={classList.join(" ")}>
                <div className="object big">
                    <span>Generating QR-code...</span>
                </div>
                <InfoComponent header="Scan from mobile Telegram"
                               description={<ol>
                                   <li>Open Telegram on your phone</li>
                                   <li>Go to Settings -> Devices -> Scan QR Code</li>
                                   <li>Scan this image to Log In</li>
                               </ol>}/>
                <div className="qr-login-button" onClick={this.props.backToPhone}>Or log in using your phone number
                </div>


            </div>
        )
    }


    open = () => {
        // TODO multiple DCs
        this.requestLoginToken().then(l => {
            /*if(l._ === "auth.loginTokenSuccess") { //idk where it goes, Maks, fix pls
                this.props.finished(l.authorization)
                return
            }*/
            const b64encoded = btoa(String.fromCharCode.apply(null, l.token)).replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '')
            const string = "tg://login?token=" + b64encoded
            const obj = this.$el.querySelector(".object")

            if (obj.firstChild) obj.removeChild(obj.firstChild);
            let qr = this.makeQR(string);
            obj.appendChild(qr)

            setTimeout(this.open, 1000 * (l.expires - MTProto.TimeManager.now(true)));
        })
    }

    /**
     Returns Promise
     **/
    requestLoginToken = () => {
        if (MTProto.isUserAuthorized()) {
            return Promise.reject({reason: "authorized"})
        }

        return MTProto.invokeMethod("auth.exportLoginToken", {
            api_id: AppConfiguration.mtproto.api.api_id,
            api_hash: AppConfiguration.mtproto.api.api_hash,
            except_ids: []
        }).catch(reject => {
            if (reject.reason === "authorized") return; //ignore
            if (reject.type === "SESSION_PASSWORD_NEEDED") {
                MTProto.invokeMethod("account.getPassword", {}).then(response => {
                    console.log(response)
                    this.props.password(response)
                })
            }
        })
    }

    /**
     Returns canvas element to insert
     **/
    makeQR = (data) => {
        return new QRCodeStyling({
            width: 240,
            height: 240,
            data: data,
            image: "./static/images/logo.svg",
            dotsOptions: {
                color: "#000000",
                type: "rounded"
            },
            imageOptions: {
                imageSize: 0.5
            },
            backgroundOptions: {
                color: "#ffffff",
            },
            qrOptions: {
                errorCorrectionLevel: "L"
            }
        })._canvas._canvas;
    }
}