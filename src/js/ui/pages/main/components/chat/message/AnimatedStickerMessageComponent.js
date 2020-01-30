import MessageWrapperFragment from "./common/MessageWrapperFragment";
import MessageTimeComponent from "./common/MessageTimeComponent"
import GeneralMessageComponent from "./common/GeneralMessageComponent"
import {StickerMessage} from "../../../../../../api/messages/objects/StickerMessage"

import lottie, {AnimationItem} from "lottie-web"
import {gzipUncompress} from "../../../../../../mtproto/utils/bin"

const AnimatedStickerFragment = ({message, w, h}) => {
    if (message.srcUrl === "") {
        return (
            <div id={`sticker-${message.id}`} className="sticker loading"
                 css-width={`${w}px`}
                 css-height={`${h}px`}/>
        )
    }
}

class AnimatedStickerMessageComponent extends GeneralMessageComponent {

    message: StickerMessage
    $sticker: Element

    width: 100
    height: 100
    animation: AnimationItem

    h() {
        this.calculateSize()

        return (
            <MessageWrapperFragment message={this.message} transparent={true} noPad>

                <AnimatedStickerFragment message={this.message}/>

                <MessageTimeComponent message={this.message} bg={true}/>

            </MessageWrapperFragment>
        )
    }

    mounted() {
        super.mounted()
        this.$sticker = this.$el.querySelector(`#sticker-${this.message.id}`)
    }

    calculateSize() {
        this.width = 100
        this.height = 100
    }

    patchSticker() {
        fetch(this.message.srcUrl)
            .then(r => {
                return r.arrayBuffer().then(b => {
                    try {
                        return JSON.parse(new TextDecoder("utf-8").decode(new Uint8Array(b)))
                    } catch (e) {
                        return JSON.parse(new TextDecoder("utf-8").decode(gzipUncompress(new Uint8Array(b))))
                    }
                })
            })
            .then(r => {
                this.animation = lottie.loadAnimation({
                    container: this.$sticker, // the dom element that will contain the animation
                    renderer: 'canvas',
                    loop: true,
                    autoplay: true,
                    name: this.message.id,
                    animationData: r // the path to the animation json
                })
            })
            .catch(r => {

            })
        // VRDOM.patch(this.$sticker, <AnimatedStickerFragment message={this.message}/>)
    }

    destroy() {
        super.destroy()
        if (this.animation) {
            this.animation.destroy()
        }
    }

    reactiveChanged(key: *, value: *, event: *) {
        super.reactiveChanged(key, value, event)

        if (event.type === "stickerLoaded") {
            this.patchSticker()
        }
    }
}

export default AnimatedStickerMessageComponent