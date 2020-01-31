import PaneComponent from "./common/PaneComponent"
import {InputComponent} from "../../main/components/input/inputComponent";

import {MTProto} from "../../../../mtproto/external"

export default class CodeInputPaneComponent extends PaneComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
    }

    h() {

        let classList = ["fading-block"]
        if (this.state.isShown === true) {
            classList.push("fade-in");
        } else if (this.state.isShown === false) {
            classList.push("fade-out");
        }

        return <div id="subCodePane" className={classList.join(" ")}>

            <div className="info">
                <div className="header"><span>{this.state.phone}</span><i className="btn-icon rp rps tgico tgico-edit"
                                                                          onClick={this.props.cancel}/>
                </div>
                <div className="description">We have sent you an SMS with the code.</div>
            </div>
            <InputComponent label="Code" type="number" filter={value => /^[\d]{0,5}$/.test(value)} input={this.onInput}
                            ref="codeInput"/>
        </div>
    }

    setData(ev) {
        this.state.phone = ev.phone
        this.state.sentCode = ev.sentCode
        this.__patch()
    }

    onInput(ev) {
        if (this.isLoading) return false
        this.props.monkeyLook(ev.target.value.length)
        if (ev.target.value.length === 5) {
            this.handleSignIn(ev.target.value)
        }
        return true
    }

    handleSignIn(phoneCode) {
        const phoneCodeHash = this.state.sentCode.phone_code_hash
        this.isLoading = true

        //this.state.phoneCode = phoneCode
        //this.state.phoneCodeHash = phoneCodeHash

        MTProto.Auth.signIn(this.state.phone, phoneCodeHash, phoneCode).then(authorization => {
            if (authorization._ === "auth.authorizationSignUpRequired") {
                // show sign up
                //fadeOut(document.getElementById("codePane"));
                //fadeIn(document.getElementById("registerPane"));
                this.props.signUp({
                    phoneCodeHash: phoneCodeHash,
                    phone: this.state.phone
                })
                return
            } else {
                this.props.finished(authorization)
                return
            }
        }, reject => {
            if (reject.type === "SESSION_PASSWORD_NEEDED") {
                MTProto.invokeMethod("account.getPassword", {}).then(response => {
                    console.log(response)
                    this.props.password(response)
                    /*if (response._ !== "passwordKdfAlgoSHA256SHA256PBKDF2HMACSHA512iter100000SHA256ModPow") {
                        throw new Error("Unknown 2FA algo")
                    }*/
                    //console.log(response)
                    //setCode2FAForm()

                    //fadeOut(document.getElementById("subCodePane"));
                    //fadeIn(document.getElementById("passwordPane"));
                    //_formData.passwordData = response
                })
            } else {
                this.refs.get("codeInput").error = "Invalid code"
            }
        }).finally(l => {
            this.isLoading = false
        })
    }
}