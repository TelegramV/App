import PaneComponent from "./PaneComponent"
import {InputComponent} from "../Elements/InputComponent";

import {MTProto} from "../../../MTProto/External"
import API from "../../../Api/Telegram/API"

export default class CodeInputPaneComponent extends PaneComponent {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        }
    }

    render() {

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
            <InputComponent label="Code" type="integer" filter={value => /^[\d]{0,5}$/.test(value)} input={this.onInput}
                            ref="codeInput"/>
        </div>
    }

    setData = (ev) => {
        this.state.phone = ev.phone
        this.state.sentCode = ev.sentCode
        this.forceUpdate()
    }

    onInput = (ev) => {
        if (this.isLoading) return false
        this.props.monkeyLook(ev.target.value.length)
        if (ev.target.value.length === 5) {
            this.handleSignIn(ev.target.value)
        }
        return true
    }

    handleSignIn = (phoneCode) => {
        const phoneCodeHash = this.state.sentCode.phone_code_hash
        this.isLoading = true

        //this.state.phoneCode = phoneCode
        //this.state.phoneCodeHash = phoneCodeHash

        API.auth.signIn(this.state.phone, phoneCodeHash, phoneCode).then(authorization => {
            if (authorization._ === "auth.authorizationSignUpRequired") {
                // show sign up
                //fadeOut(document.getElementById("codePane"));
                //fadeIn(document.getElementById("registerPane"));
                this.props.signUp({
                    phoneCodeHash: phoneCodeHash,
                    phone: this.state.phone
                })

            } else {
                this.props.finished(authorization)

            }
        }).catch(reject => {
            if (reject.type === "SESSION_PASSWORD_NEEDED") {
                MTProto.invokeMethod("account.getPassword", {}).then(response => {
                    console.log(response)
                    this.props.password(response)
                })
            } else {
                this.refs.get("codeInput").error = "Invalid code" // todo: fix
            }
        }).finally(l => {
            this.isLoading = false
        })
    }
}