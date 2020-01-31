import PaneComponent from "./common/PaneComponent"
import CodeInputPaneComponent from "./CodeInputPaneComponent"
import PasswordInputPaneComponent from "./PasswordInputPaneComponent"

import {MonkeyController} from "../monkey"

export default class CodeAndPasswordPaneComponent extends PaneComponent {
    constructor(props) {
        super(props);
        this.state = {
            monkey: new MonkeyController()
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

        return <div className={classList.join(" ")}>
            <div id="monkey" className="object"/>
            <CodeInputPaneComponent ref="code" cancel={this.props.cancelCode} finished={this.props.finished}
                                password={this.onPassword}
                                monkeyLook={this.state.monkey.monkeyLook.bind(this.state.monkey)} signUp={this.props.signUp}/>
            <PasswordInputPaneComponent ref="password" finished={this.props.finished}
                                    monkeyClose={this.state.monkey.close.bind(this.state.monkey)}
                                    monkeyPeek={this.monkeyPeek}/>
        </div>
    }

    monkeyPeek(e) {
        if (e) {
            this.state.monkey.peek()
        } else {
            this.state.monkey.open()
        }
    }

    open() {
        this.state.monkey.init(document.getElementById("monkey"))
        // this.state.monkey.reset()
        // this.state.monkey.stop()
    }

    onPassword(ev) {
        this.refs.get("password").setData(ev)
        this.props.password(ev)
    }
}