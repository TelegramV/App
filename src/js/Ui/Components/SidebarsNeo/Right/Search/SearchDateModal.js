import StatefulComponent from "../../../../../V/VRDOM/component/StatefulComponent";
import VCalendar from "../../../../Elements/VCalendar";
import {ModalHeaderFragment} from "../../../Modals/ModalHeaderFragment";
import {ModalFooterFragment} from "../../../Modals/ModalFooterFragment";
import VUI from "../../../../VUI";
import UIEvents from "../../../../EventBus/UIEvents";
import SearchManager from "../../../../../Api/Search/SearchManager";
import AppSelectedChat from "../../../../Reactive/SelectedChat";
import {SearchMessage} from "../../../../../Api/Messages/SearchMessage";
import PeersManager from "../../../../../Api/Peers/PeersManager";
import {MessageFactory} from "../../../../../Api/Messages/MessageFactory";
import API from "../../../../../Api/Telegram/API";

export class SearchDateModal extends StatefulComponent {
    state = {
        date: new Date()
    }

    render() {
        return (
            <div>
                <ModalHeaderFragment title={this.state.date.toLocaleDateString("en", {
                    weekday: "short",
                    month: "long",
                    day: "numeric"
                })}/>
                <VCalendar blockFuture onSelect={this.onSelect}/>
                <ModalFooterFragment buttons={[
                    {
                        text: "Cancel",
                        onClick: this.onCancel
                    },
                    {
                        text: "Jump to date",
                        onClick: _ => this.onJumpToDate()
                    }
                ]}/>
            </div>
        )
    }

    onCancel = () => {
        VUI.Modal.close()
    }

    onJumpToDate = () => {
        this.state.date.setHours(0, 0, 0, 0)
        API.messages.getHistory(AppSelectedChat.Current, {
            offset_date: Math.round(this.state.date.getTime()/1000),
            add_offset: -1,
            limit: 1
        }).then(Messages => {
            if(Messages.messages.length > 0) {
                const messages = AppSelectedChat.Current.messages.putRawMessages(Messages.messages)
                console.log(messages)
                UIEvents.General.fire("chat.showMessage", {message: messages[0]})
            }
        })
    //     SearchManager.searchMessages(AppSelectedChat.Current, {
    //         max_date: Math.round(+this.state.date/1000),
    //         limit: 50,
    //     }).then(Messages => {
    //         if(Messages.messages.length > 0) {
    //             const messages = AppSelectedChat.Current.messages.putRawMessages(Messages.messages)
    //             console.log(messages)
    //             UIEvents.General.fire("chat.showMessage", {message: messages[0]})
    // }
            // UIEvents.General.fire("chat.showMessage", {message: message})}

        // })
        VUI.Modal.close()
    }

    onSelect = (date) => {
        this.setState({
            date
        })
    }
}