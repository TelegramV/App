import {VRDOMPlugin} from "../v/vrdom/plugin"
import {replaceEmoji} from "../utils/emoji"

class EmojiVRDOMPlugin extends VRDOMPlugin {

    elementPatched($el) {
        this.elementMounted($el)
    }

    elementMounted($el) {
        if ($el.nodeType !== Node.TEXT_NODE && $el.textContent) {
            replaceEmoji($el)
        }
    }
}

const EmojiPlugin = new EmojiVRDOMPlugin()

export default EmojiPlugin
