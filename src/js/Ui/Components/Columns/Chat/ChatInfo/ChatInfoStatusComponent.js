import AppEvents from "../../../../../Api/EventBus/AppEvents"
import AppSelectedChat from "../../../../Reactive/SelectedChat"
import UIEvents from "../../../../EventBus/UIEvents"
import classNames from "../../../../../V/VRDOM/jsx/helpers/classNames"
import classIf from "../../../../../V/VRDOM/jsx/helpers/classIf"
import TranslatableStatefulComponent from "../../../../../V/VRDOM/component/TranslatableStatefulComponent"

class ChatInfoStatusComponent extends TranslatableStatefulComponent {
    state = {
        isLoading: false,
    };

    appEvents(E) {
        super.appEvents(E)
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
                    <div className="info">{this.l("lng_profile_loading")}</div>
                </div>
            )
        }

        const status = this.status;

        const isLoading = status.isAction || status.isLoading;
        const text = status ? this.lp(status) : "";

        const classes = classNames(
            "info",
            classIf(AppSelectedChat.Current?.online, "online"),
            classIf(isLoading, "loading-text"),
        )

        return (
            <div className="bottom">
                <div hideIf={AppSelectedChat.Current?.isSelf}
                     className={classes}>{text}</div>
            </div>
        )
    }

    get action() {
        if (AppSelectedChat.Current && AppSelectedChat.Current.dialog && AppSelectedChat.Current.dialog.actions.size > 0) {
            return AppSelectedChat.Current.dialog.action
        }
    }

    get status() {
        if (AppSelectedChat.isNotSelected) {
            return {}
        }
        return this.action ||AppSelectedChat.Current.status;
    }

    onChatLoading = ({isLoading}) => {
        this.setState({
            isLoading
        });
    }
}

export default ChatInfoStatusComponent