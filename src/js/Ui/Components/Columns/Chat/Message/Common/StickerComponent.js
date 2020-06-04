import {FileAPI} from "../../../../../../Api/Files/FileAPI"
import UIEvents from "../../../../../EventBus/UIEvents"
import lottie from "../../../../../../../../vendor/lottie-web"
import StatelessComponent from "../../../../../../V/VRDOM/component/StatelessComponent"

export let stickerCounter = 0;
// dont use it anymore
export default class StickerComponent extends StatelessComponent {
    init() {
        this.updateSticker();
    }

    updateSticker() {
        this.sticker = this.props.sticker;
        this.width = this.props.width || 250;
        let sizeAttr = this.sticker.attributes.find(l => l._ === "documentAttributeImageSize");
        this.height = this.props.height || (sizeAttr ? sizeAttr.h / sizeAttr.w * this.width : this.width);
        this.animated = this.sticker.mime_type === "application/x-tgsticker";
        this.url = undefined;
        this.identifier = "sticker-" + stickerCounter++
    }

    render() {
        if (this.animated) {
            return (
                <div className="sticker loading"
                     css-width={`${this.width}px`}
                     css-height={`${this.height}px`}
                     onMouseOver={this._mOver}
                     onMouseOut={this._mOut}
                     onClick={this.props.onClick}/>
            )
        } else {
            return (
                <img className="sticker loading"
                     src={this.url}
                     css-width={`${this.width}px`}
                     css-height={`${this.height}px`}
                     onClick={this.props.onClick}/>
            )
        }
    }

    componentDidMount() {
        super.componentDidMount()
        this.downloadAndApply();
    }

    componentDidUpdate() {
        this.updateSticker();
        this.downloadAndApply();
    }

    downloadAndApply() {
        if (this.animation) {
            this.animation.destroy();
        }
        FileAPI.getFile(this.sticker).then(url => {
            if (this.__.destroyed) return; //sorry, we're late
            if (this.animated) {
                this._applyAnimated(url);
            } else {
                this._applySticker(url);
            }
        }).then(_ => {
            if (this.__.destroyed) return;
            this.$el.classList.remove("loading");
        })
    }

    _applySticker(url) {
        this.url = url;
        this.$el.src = url;
    }

    _applyAnimated(url) {
        this.url = url;
        fetch(url)
            .then(r => r.arrayBuffer().then(b => new Uint8Array(b)))
            .then(b => FileAPI.decodeAnimatedSticker(b))
            .then(json => {
                this.animation = lottie.loadAnimation({
                    container: this.$el,
                    renderer: 'canvas',
                    loop: false,
                    autoplay: this.props.play || false,
                    name: this.identifier,
                    animationData: json
                })
                this.animation.setSubframe(false);
                this.animation.addEventListener("complete", this._onLoop);
            })
    }

    _mOver = (ev) => {
        this.hovered = true;
        if (!this.animation) return;
        this.animation.loop = true;
        this.animation.play();
    }

    _mOut = (ev) => {
        this.hovered = false;
        if (!this.animation) return;
        this.animation.loop = false;
    }

    _onLoop = (ev) => {
        UIEvents.General.fire("sticker.loop", {sticker: this.sticker});
    }

    componentWillUnmount() {
        if (this.animated && this.animation) {
            this.animation.destroy();
        }
    }
}