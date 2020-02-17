import Component from "../../../../V/VRDOM/Component";
import PhoneInputPaneComponent from "./PhoneInputPaneComponent";
import CodeAndPasswordPaneComponent from "./CodeAndPasswordPaneComponent"
import QRLoginPaneComponent from "./QRLoginPaneComponent"
import RegisterPaneComponent from "./RegisterPaneComponent"

import {AppPermanentStorage} from "../../../../Api/Common/storage"
import VF from "../../../../V/VFramework"

export default class LoginComponent extends Component {
    constructor(props) {
        super(props);
    }

    h() {
        return (
            <div id="login">
                <PhoneInputPaneComponent finished={this.handleSendCode} ref="phonePane" qrLoginInit={this.qrLoginInit}/>
                <CodeAndPasswordPaneComponent ref="codeAndPassword" cancelCode={this.cancelCode}
                                              password={this.password} finished={this.loginSuccess}
                                              signUp={this.signUp}/>
                <QRLoginPaneComponent ref="qrLoginPane" finished={this.loginSuccess} backToPhone={this.backToPhone}
                                      password={this.passwordQr}/>
                <RegisterPaneComponent ref="registerPane" finished={this.loginSuccess}/>
            </div>
        )
    }

    backToPhone(l) {
        this.fadeOut(this.refs.get("qrLoginPane"));
        this.fadeIn(this.refs.get("phonePane"));
    }

    qrLoginInit() {
        this.refs.get("qrLoginPane").open()

        this.fadeOut(this.refs.get("phonePane"));
        this.fadeIn(this.refs.get("qrLoginPane"));
    }

    loginSuccess(response) {
        AppPermanentStorage.setItem("authorizationData", response)
        VF.router.push("/")
        console.log("login success!")
    }

    signUp(ev) {
        this.refs.get("registerPane").setData(ev)

        this.fadeIn(this.refs.get("registerPane"));
        this.fadeOut(this.refs.get("codeAndPassword"));
    }

    password() {
        this.fadeOut(this.refs.get("codeAndPassword").refs.get("code"));
        this.fadeIn(this.refs.get("codeAndPassword").refs.get("password"));
    }

    passwordQr(data) {
        console.log(data)
        this.refs.get("codeAndPassword").open()

        this.refs.get("codeAndPassword").refs.get("password").setData(data)

        this.fadeOut(this.refs.get("qrLoginPane"));
        this.fadeIn(this.refs.get("codeAndPassword"));

        this.fadeOut(this.refs.get("codeAndPassword").refs.get("code"));
        this.fadeIn(this.refs.get("codeAndPassword").refs.get("password"));
    }

    cancelCode() {
        this.fadeIn(this.refs.get("phonePane"));
        this.fadeOut(this.refs.get("codeAndPassword"));
    }

    handleSendCode(ev) {
        this.refs.get("codeAndPassword").open()

        this.refs.get("codeAndPassword").refs.get("code").setData(ev)
        this.fadeOut(this.refs.get("phonePane"));
        this.fadeIn(this.refs.get("codeAndPassword"));
    }


    fadeOut(elem) {
        elem.isShown = false
    }

    fadeIn(elem) {
        elem.isShown = true
    }
}