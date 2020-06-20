import AppEvents from "../../../../../Api/EventBus/AppEvents"
import AppSelectedChat from "../../../../Reactive/SelectedChat"
import UIEvents from "../../../../EventBus/UIEvents"
import classNames from "../../../../../V/VRDOM/jsx/helpers/classNames"
import classIf from "../../../../../V/VRDOM/jsx/helpers/classIf"
import StatefulComponent from "../../../../../V/VRDOM/component/StatefulComponent"

class ChatInfoStatusComponent extends StatefulComponent {
    state = {
        isLoading: false,
    };

    appEvents(E) {
        E.bus(AppEvents.Dialogs)
            .filter(event => AppSelectedChat.check(event.dialog.peer))
            .updateOn("updateActions")

        E.bus(AppEvents.Peers)
            .filter(event => AppSelectedChat.check(event.peer))
            .updateOn("updateUserStatus")
            .updateOn("updateChatOnlineCount")
            .updateOn("fullLoaded")
            .updateOn("messages.allRecent")
            .updateOn("messages.recent")

        E.bus(UIEvents.General)
            .updateOn("chat.select")
            .on("chat.loading", this.onChatLoading)
    }

    render() {
        if (AppSelectedChat.isSelected && AppSelectedChat.current.messages.isDownloadingRecent) {
            return (
                <div className="bottom">
                    <div className="info loading-text">loading messages</div>
                </div>
            )
        }

        const isOnline = this.statusLine.online;
        const isLoading = this.statusLine.isAction || this.statusLine.isLoading;
        const text = this.statusLine.text;

        const classes = classNames(
            "info",
            classIf(isOnline, "online"),
            classIf(isLoading, "loading-text"),
        )

        return (
            <div className="bottom">
                <div hideIf={AppSelectedChat.isSelected && AppSelectedChat.Current.isSelf}
                     className={classes}>{text}</div>
            </div>
        )
    }

    get action() {
        if (AppSelectedChat.Current && AppSelectedChat.Current.dialog && AppSelectedChat.Current.dialog.actions.size > 0) {
            const action = AppSelectedChat.Current.dialog.actionText

            if (action) {
                return action.user + " " + action.action
            }
        }

        return false
    }

    get statusLine() {
        if (AppSelectedChat.isNotSelected) {
            return {}
        }

        const action = this.action

        if (action) {
            return {text: action, isAction: true, isLoading: false}
        }

        return AppSelectedChat.Current.statusString
    }

    onChatLoading = ({isLoading}) => {
        this.setState({
            isLoading
        });
    }
}

export default ChatInfoStatusComponent