import {FrameworkComponent} from "../../framework/component"
import {DialogListComponent} from "./components/dialogList"

export class IMPage extends FrameworkComponent {
    constructor(props = {}) {
        super()
    }

    h() {
        return (
            <div className="app">
                <div className="chatlist">
                    <div className="toolbar">
                        <div className="btn-icon rp rps tgico-menu"></div>
                        <div className="search">
                            <div className="input-search">
                                <input type="text" placeholder="Search"/><span className="tgico tgico-search"></span>
                            </div>
                        </div>
                    </div>
                    <div className="connecting" id="connecting_message">
                        <progress className="progress-circular"/>
                        <span>Waiting for network...</span>
                    </div>
                    <DialogListComponent/>

                    {/*// TODO костыли*/}
                </div>
                <div id="message_list"/>

            </div>
        )
    }
}