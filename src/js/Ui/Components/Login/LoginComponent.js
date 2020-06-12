// import PhoneInputPaneComponent from "./PhoneInputPaneComponent";
// import CodeAndPasswordPaneComponent from "./CodeAndPasswordPaneComponent"
// import QRLoginPaneComponent from "./QRLoginPaneComponent"
// import RegisterPaneComponent from "./RegisterPaneComponent"
// import VComponent from "../../../V/VRDOM/component/VComponent"
// import VApp from "../../../V/vapp"
// import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent"
//
// export default class LoginComponent extends StatelessComponent {
//
//     qrLoginPaneRef = VComponent.createComponentRef()
//     phonePaneRef = VComponent.createComponentRef()
//     registerPaneRef = VComponent.createComponentRef()
//     codeAndPasswordRef = VComponent.createComponentRef()
//
//     constructor(props) {
//         super(props);
//     }
//
//     render() {
//         return (
//             <div id="login">
//                 <PhoneInputPaneComponent finished={this.handleSendCode} ref={this.phonePaneRef}
//                                          qrLoginInit={this.qrLoginInit}/>
//                 <CodeAndPasswordPaneComponent ref={this.codeAndPasswordRef} cancelCode={this.cancelCode}
//                                               password={this.password} finished={this.loginSuccess}
//                                               signUp={this.signUp}/>
//                 <QRLoginPaneComponent ref={this.qrLoginPaneRef} finished={this.loginSuccess}
//                                       backToPhone={this.backToPhone}
//                                       password={this.passwordQr}/>
//                 <RegisterPaneComponent ref={this.registerPaneRef} finished={this.loginSuccess}/>
//             </div>
//         )
//     }
//
//     backToPhone = (l) => {
//         this.fadeOut(this.qrLoginPaneRef.component);
//         this.fadeIn(this.phonePaneRef.component);
//     }
//
//     qrLoginInit = () => {
//         this.qrLoginPaneRef.component.open()
//
//         this.fadeOut(this.phonePaneRef.component);
//         this.fadeIn(this.qrLoginPaneRef.component);
//     }
//
//     loginSuccess = (response) => {
//         localStorage.setItem("user", response.user.id)
//         VApp.router.push("/")
//         console.log("login success!")
//     }
//
//     signUp = (ev) => {
//         this.refs.get(this.registerPaneRef.component).setData(ev)
//
//         this.fadeIn(this.registerPaneRef.component);
//         this.fadeOut(this.codeAndPasswordRef.component);
//     }
//
//     password = () => {
//         this.fadeOut(this.codeAndPasswordRef.component.codeRef.component);
//         this.fadeIn(this.codeAndPasswordRef.component.passwordRef.component);
//     }
//
//     passwordQr = (data) => {
//         console.log(data)
//         this.codeAndPasswordRef.component.open()
//
//         this.codeAndPasswordRef.component.passwordRef.component.setData(data)
//
//         this.fadeOut(this.qrLoginPaneRef.component);
//         this.fadeIn(this.codeAndPasswordRef.component);
//
//         this.fadeOut(this.codeAndPasswordRef.component.codeRef.component);
//         this.fadeIn(this.codeAndPasswordRef.component.passwordRef.component);
//     }
//
//     cancelCode = () => {
//         this.fadeIn(this.phonePaneRef.component);
//         this.fadeOut(this.codeAndPasswordRef.component);
//     }
//
//     handleSendCode = (ev) => {
//         this.codeAndPasswordRef.component.open()
//
//         this.codeAndPasswordRef.component.codeRef.component.setData(ev)
//         this.fadeOut(this.phonePaneRef.component);
//         this.fadeIn(this.codeAndPasswordRef.component);
//     }
//
//
//     fadeOut = (elem) => {
//         elem.isShown = false
//     }
//
//     fadeIn = (elem) => {
//         elem.isShown = true
//     }
// }