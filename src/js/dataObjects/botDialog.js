import {UserDialog} from "./userDialog";

export class BotDialog extends UserDialog {
    get onlineStatus() {
        return {
            online: false,
            status: "bot"
        }
    }
}