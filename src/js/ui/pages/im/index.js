import {FrameworkComponent} from "../../framework/component"
import {DialogListComponent} from "./components/dialogList"

export class IMPage extends FrameworkComponent {
    constructor(props = {}) {
        super()
    }

    h() {
        return (
            <div id="container" className="grid chats-grid">
                <div className="dialog-container">
                    <div className="dialog-header">
                        <img className="menu-button" src="/static/images/icons/menu_svg.svg"/>
                        <div className="search-box">
                            <input className="default-input search-input" type="text" name="search"
                                   placeholder="Search"/></div>
                    </div>
                    <div className="dialog-list-panel">
                        <div className="dialog-list">
                            <DialogListComponent/>
                        </div>
                    </div>

                </div>
                <div id="message_list"/>
            </div>
        )
    }
}