import PaneComponent from "./PaneComponent"
import CodeInputPaneComponent from "./CodeInputPaneComponent"
import PasswordInputPaneComponent from "./PasswordInputPaneComponent"

import {MonkeyController} from "../../Pages/Login/MonkeyController"
import VComponent from "../../../V/VRDOM/component/VComponent"

export default class CodeAndPasswordPaneComponent extends PaneComponent {

    codeRef = VComponent.createComponentRef()
    passwordRef = VComponent.createComponentRef()

    constructor(props) {
        super(props);
        this.state = {
            monkey: new MonkeyController()
        }
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

        return <div className={classList.join(" ")}>
            <div id="monkey" className="object"/>
            <CodeInputPaneComponent ref={this.codeRef} cancel={this.props.cancelCode} finished={this.props.finished}
                                password={this.onPassword}
                                monkeyLook={this.state.monkey.monkeyLook.bind(this.state.monkey)} signUp={this.props.signUp}/>
            <PasswordInputPaneComponent ref={this.passwordRef} finished={this.props.finished}
                                    monkeyClose={this.state.monkey.close.bind(this.state.monkey)}
                                    monkeyPeek={this.monkeyPeek}/>
        </div>
    }

    monkeyPeek = (e) => {
            this.state.monkey.peek()
    }

    open = () => {
        this.state.monkey.init(document.getElementById("monkey"))
        // this.state.monkey.reset()
        // this.state.monkey.stop()
    }

    onPassword = (ev) => {
        this.passwordRef.component.setData(ev)
        this.props.password(ev)
    }
}