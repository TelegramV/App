import PaneComponent from "./common/PaneComponent"
import InfoComponent from "./common/infoComponent"
import {ButtonWithProgressBarComponent} from "../../main/components/input/buttonComponent";
import {InputComponent} from "../../main/components/input/inputComponent";

import MTProto from "../../../../mtproto/external"

export default class PasswordInputPaneComponent extends PaneComponent {
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
        } else {
            classList.push("hidden");
        }

        return <div id="passwordPane" className={classList.join(" ")}>
            <InfoComponent header="Enter a Password"
                           description="Your account is protected with an additional password."/>

            <InputComponent label={(this.state.response && this.state.response.hint ? "Hint: " + this.state.response.hint : "Password")} type="password"
                            hide ref="passwordInput" peekChange={this.onPeekChange}/>


            <ButtonWithProgressBarComponent label="Next" click={this.handlePasswordSend} ref="nextPassword"/>
        </div>
    }

    onPeekChange(e) {
        this.props.monkeyPeek(e)
    }

    setData(ev) {
        this.props.monkeyClose()
        this.state.response = ev
        this.__patch()
    }

    async handlePasswordSend() {
        if (this.state.isLoading) return
        this.state.isLoading = true

        const passwordInput = this.refs.get("passwordInput")
        const next = this.refs.get("nextPassword")
        const password = passwordInput.getValue()

        next.isLoading = true
        next.label = "Please wait..."

        const response = this.state.response
        const salt1 = response.current_algo.salt1
        const salt2 = response.current_algo.salt2
        const g = response.current_algo.g
        const p = response.current_algo.p
        const srp_id = response.srp_id
        const srp_B = response.srp_B

        const srp_ret = await MTProto.performWorkerTask("mt_srp_check_password", {
            g,
            p,
            salt1,
            salt2,
            srp_id,
            srp_B,
            password
        })

        MTProto.invokeMethod("auth.checkPassword", {
            password: {
                _: "inputCheckPasswordSRP",
                srp_id: srp_ret.srp_id,
                A: srp_ret.A,
                M1: srp_ret.M1
            }
        }).then(response => {
            // resetNextButton($passwordNext)
            // console.log(response);
            //
            this.props.finished(response)
            //authorizedStart(response)
        }, reject => {
            // console.log(reject)
            // $phoneInput.classList.add("invalid");
            //
            if (reject.type === "INVALID_PASSWORD_HASH") {
                this.refs.get("passwordInput").error = "Invalid password"
            } else {
                this.refs.get("passwordInput").error = reject.type
            }

        }).finally(l => {
            this.state.isLoading = false
            next.isLoading = false
            next.label = "Next"
        })
    }
}