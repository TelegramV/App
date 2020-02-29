import VComponent from "../../../../../V/VRDOM/component/VComponent"
import {FileAPI} from "../../../../../Api/Files/FileAPI"

import MTProto from "../../../../../MTProto/external"

let stickerCounter = 0;

export default class StickerComponent extends VComponent {
    constructor(props) {
        super(props)

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
                     onMouseOut={this._mOut}/>
            )
        } else {
            return (
                <img className="sticker loading"
                     src={this.url}
                     css-width={`${this.width}px`}
                     css-height={`${this.height}px`}/>
            )
        }
    }

    componentDidMount() {
        this.downloadAndApply();
    }

    downloadAndApply() {
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
        fetch(url).then(async r => {
            return r.arrayBuffer().then(async b => {
                try {
                    return JSON.parse(new TextDecoder("utf-8").decode(new Uint8Array(b)))
                } catch (e) {
                    return JSON.parse(new TextDecoder("utf-8").decode(await MTProto.performWorkerTask("gzipUncompress", new Uint8Array(b))))
                }
            })
        }).then(r => {
            this.animation = lottie.loadAnimation({
                container: this.$el,
                renderer: 'canvas',
                loop: false,
                autoplay: true,
                name: this.identifier,
                animationData: r
            })
            this.animation.setSubframe(false);
        }).catch(r => {

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

    componentWillUnmount() {
        if (this.animated && this.animation) {
            this.animation.destroy();
        }
    }
}