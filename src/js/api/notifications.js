import MTProto from "../mtproto";
import {playSound} from "../ui/audio";

export function notify(update) {
    // TODO parse current chat etc
    const sound = document.hasFocus() ? "in" : "notification"
    playSound(sound)
}

export function attach() {
    console.log("test")
    // MTProto.MessageProcessor.listenUpdateShortMessage(notify)
}