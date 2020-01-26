import {VRDOMPlugin} from "../v/vrdom/plugin"
import replaceEmoji from "../utils/emoji"

class EmojiVRDOMPlugin extends VRDOMPlugin {
    elementMounted($el) {
        if ($el.nodeType !== Node.TEXT_NODE && $el.textContent) {
            new Promise(async (resolve, reject) => {
                replaceEmoji($el);
                resolve();
            })
        }
    }
}

const EmojiPlugin = new EmojiVRDOMPlugin()

export default EmojiPlugin
