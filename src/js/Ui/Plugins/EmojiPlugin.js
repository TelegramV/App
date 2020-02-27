import VRDOMPlugin from "../../V/VRDOM/plugin/VRDOMPlugin"
import {replaceEmoji} from "../Utils/replaceEmoji"

class EmojiVRDOMInterceptor extends VRDOMPlugin {
    elementDidUpdate($el) {
        this.elementDidMount($el)
    }

    elementDidMount($el) {
        if ($el.nodeType !== Node.TEXT_NODE && $el.textContent) {
            replaceEmoji($el)
        }
    }
}

export default EmojiVRDOMInterceptor
