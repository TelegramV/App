import Component from "./framework/vrdom/component";
import ChatInfoAvatarComponent from "./pages/main/components/chat/chatInfo/chatInfoAvatarComponent";
import {PhotoComponent} from "./pages/main/components/chat/message/photoMessageComponent";
import MTProto from "../mtproto";

export let InstantViewManager

export class InstantViewComponent extends Component {
    constructor(props) {
        super(props)
        InstantViewManager = this
        this.state = {
            hidden: true,
            history: []
        }
    }

    parseRichText(richText) {
        switch (richText._) {
            case "textEmpty":
                return ""
            case "textPlain":
                return richText.text
            case "textBold":
                return <b>{this.parseRichText(richText.text)}</b>
            case "textItalic":
                return <i>{this.parseRichText(richText.text)}</i>
            case "textUnderline":
                return <u>{this.parseRichText(richText.text)}</u>
            case "textStrike":
                return <s>{this.parseRichText(richText.text)}</s>
            case "textFixed":
                return <code>{this.parseRichText(richText.text)}</code>
            case "textUrl":
                if(richText.webpage_id !== "0") {
                    return <a onClick={l => this.downloadAndOpen(richText.url)} className="has-instant-view">{this.parseRichText(richText.text)}</a>
                } else {
                    return <a href={richText.url}>{this.parseRichText(richText.text)}</a>
                }
            case "textEmail":
                return <a href={`mailto:${richText.email}`}>{this.parseRichText(richText.text)}</a>
            case "textSubscript":
                return <sub>{this.parseRichText(richText.text)}</sub>
            case "textSuperscript":
                return <sup>{this.parseRichText(richText.text)}</sup>
            case "textMarked":
                return <mark>{this.parseRichText(richText.text)}</mark>
            case "textPhone":
                return <a href={`tel:${richText.phone}`}>{this.parseRichText(richText.text)}</a>
            case "textImage":
                return <figure className="icon">PHOTO_HERE_TODO</figure>
            case "textAnchor":
                return <a href={`#${richText.name}`}>{this.parseRichText(richText.text)}</a>

            case "textConcat":
                return richText.texts.map(this.parseRichText)

            default:
                return "unsupported"
        }
    }

    parseBlock(l) {
        switch(l._) {
            case "pageBlockCover":
                return this.parseBlock(l.cover)

            case "pageBlockChannel":
                return <div className="channel">Channel: {l.channel.title}</div>
            case "pageBlockTitle":
                return <h1>{this.parseRichText(l.text)}</h1>
            case "pageBlockSubtitle":
                return <h2>{this.parseRichText(l.text)}</h2>
            case "pageBlockKicker":
                return <span>{this.parseRichText(l.text)}</span>
            case "pageBlockAuthorDate":
                return <div className="byline">
                    {l.author._ !== "textEmpty" ? <address className="author">by <a rel="author" href="#">{this.parseRichText(l.author)}</a></address> : ""}
                    {l.published_date > 0 ? <time>on {l.published_date}</time> : ""}
                </div>

            case "pageBlockParagraph":
                return <p>{this.parseRichText(l.text)}</p>
            case "pageBlockHeader":
                return <h3>{this.parseRichText(l.text)}</h3>
            case "pageBlockSubheader":
                return <h4>{this.parseRichText(l.text)}</h4>
            case "pageBlockPreformatted":
                // TODO language
                return <pre>{this.parseRichText(l.text)}</pre>
            case "pageBlockFooter":
                return <footer>{this.parseRichText(l.text)}</footer>
            case "pageBlockDivider":
                return <hr/>
            case "pageBlockAnchor":
                return <a id={l.name}/>
            case "pageBlockOrderedList":
                return <ol>
                    {l.items.map(l => {
                        if(l._ === "pageListOrderedItemText") {
                            return <li value={l.num}>{this.parseRichText(l.text)}</li>
                        } else if(l._ === "pageListOrderedItemBlocks") {
                            return <li value={l.num}>{l.blocks.map(this.parseBlock)}</li>
                        }
                    })}
                </ol>
            case "pageBlockList":
                return <ul>
                    {l.items.map(l => {
                        if(l._ === "pageListItemText") {
                            return <li>{this.parseRichText(l.text)}</li>
                        } else if(l._ === "pageListItemBlocks") {
                            return <li>{l.blocks.map(this.parseBlock)}</li>
                        }
                    })}
                </ul>
            case "pageBlockBlockquote":
                return <blockquote>{this.parseRichText(l.text)}<cite>{this.parseRichText(l.caption)}</cite></blockquote>
            case "pageBlockPullquote":
                return <aside>{this.parseRichText(l.text)}<cite>{this.parseRichText(l.caption)}</cite></aside>

            case "pageBlockPhoto":
                return <PhotoComponent photo={this.findPhoto(l.photo_id)}/>
            case "pageBlockVideo":
                return <figure>Video here</figure>
            case "pageBlockAudio":
                return <figure>Audio here</figure>
            case "pageBlockEmbed":
                return <iframe/>

            case "pageBlockCollage":
                return <collage/>
            case "pageBlockSlideshow":
                return <slideshow/>

            case "pageBlockTable":
                return <table/>
            case "pageBlockDetails":
                return <details/>
            case "pageBlockRelatedArticles":
                return <related/>
            case "pageBlockMap":
                return <iframe/>

            default:
            case "pageBlockUnsupported":
                console.log("parsing", l)
                return <div css-color="red">Unsupported element</div>
        }
    }

    findPhoto(photoId) {
        return this.state.page.photos.find(l => l.id === photoId)
    }

    h() {
        console.log(this.state.page)
        return (
            <div className={["instant-view-wrapper", this.state.hidden ? "hidden" : ""]}>
                {this.state.page ?
                    <div className="instant-view">
                        <div className="header">
                            <i className="tgico tgico-back" onClick={this.close}/>
                            <span>{this.state.page.siteName}</span>
                            <i className="tgico tgico-more"/>
                        </div>
                        <div className="content">
                            {this.state.page.blocks.map(this.parseBlock)}
                        </div>
                    </div>
                    : ""}
            </div>
        )
    }

    close() {
        this.state.page = null
        if(this.state.history.length > 0) {
            this.state.page = this.state.history.pop()
        }
        if(!this.state.page) {
            this.state.hidden = true
        }
        this.__patch()
    }

    downloadAndOpen(url) {
        MTProto.invokeMethod("messages.getWebPage", {
            url: url
        }).then(l => {
            console.log(l)
            l.cached_page.photos.push(l.photo)
            this.open(l.cached_page, l.site_name)
        })
    }

    open(page, siteName = "") {
        if(this.state.page !== null) {
            this.state.history.push(this.state.page)
        }
        this.state.hidden = false
        this.state.page = page
        this.state.page.siteName = siteName
        this.__patch()
    }
}