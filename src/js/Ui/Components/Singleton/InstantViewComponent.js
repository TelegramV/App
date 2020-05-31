/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import MTProto from "../../../MTProto/External";
import VUI from "../../VUI"
import nodeIf from "../../../V/VRDOM/jsx/helpers/nodeIf"
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"
import BetterPhotoComponent from "../Basic/BetterPhotoComponent"

export class InstantViewComponent extends StatefulComponent {

    state = {
        hidden: true,
        history: []
    }

    init() {
        VUI.InstantView = this
    }

    parseRichText = (richText) => {
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
                if (richText.webpage_id !== "0") {
                    return <a onClick={l => this.downloadAndOpen(richText.url)}
                              className="has-instant-view">{this.parseRichText(richText.text)}</a>
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

    parseBlock = (block) => {
        switch (block._) {
            case "pageBlockCover":
                return <div className="cover">{this.parseBlock(block.cover)}</div>

            case "pageBlockChannel":
                return <div className="channel">Channel: {block.channel.title}</div>
            case "pageBlockTitle":
                return <h1>{this.parseRichText(block.text)}</h1>
            case "pageBlockSubtitle":
                return <h2>{this.parseRichText(block.text)}</h2>
            case "pageBlockKicker":
                return <span>{this.parseRichText(block.text)}</span>
            case "pageBlockAuthorDate":
                return <span className="byline">
                    {block.author._ !== "textEmpty" ?
                        <address className="author">by {this.parseRichText(block.author)}</address> : ""}
                    {block.published_date > 0 ? <time>on {new Date(block.published_date * 1000).toLocaleString("en", {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour12: false,
                        timeZone: "UTC",
                        hour: "numeric",
                        minute: "numeric"
                    })}</time> : ""}
                </span>

            case "pageBlockParagraph":
                return <p>{this.parseRichText(block.text)}</p>
            case "pageBlockHeader":
                return <h3>{this.parseRichText(block.text)}</h3>
            case "pageBlockSubheader":
                return <h4>{this.parseRichText(block.text)}</h4>
            case "pageBlockPreformatted":
                // TODO language
                return <pre>{this.parseRichText(block.text)}</pre>
            case "pageBlockFooter":
                return <footer>{this.parseRichText(block.text)}</footer>
            case "pageBlockDivider":
                return <hr/>
            case "pageBlockAnchor":
                return <a id={block.name} className="anchor"/>
            case "pageBlockOrderedList":
                return <ol>
                    {block.items.map(l => {
                        if (l._ === "pageListOrderedItemText") {
                            return <li value={l.num}>{this.parseRichText(l.text)}</li>
                        } else if (l._ === "pageListOrderedItemBlocks") {
                            return <li value={l.num}>{l.blocks.map(this.parseBlock)}</li>
                        }
                    })}
                </ol>
            case "pageBlockList":
                return <ul>
                    {block.items.map(item => {
                        if (item._ === "pageListItemText") {
                            return <li>{this.parseRichText(item.text)}</li>
                        } else if (item._ === "pageListItemBlocks") {
                            return <li>{item.blocks.map(this.parseBlock)}</li>
                        }
                    })}
                </ul>
            case "pageBlockBlockquote":
                return <blockquote>{this.parseRichText(block.text)}<cite>{this.parseRichText(block.caption)}</cite>
                </blockquote>
            case "pageBlockPullquote":
                return <aside>{this.parseRichText(block.text)}<cite>{this.parseRichText(block.caption)}</cite></aside>

            case "pageBlockPhoto":
                return <BetterPhotoComponent photo={this.findPhoto(block.photo_id)}/>
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
                const classes = {
                    bordered: block.bordered,
                    striped: block.striped
                }
                console.log(classes)
                return <figure>
                    <table className={classes}>
                        {block.rows.map(row => {
                            return <tr>{row.cells.map(cell => {
                                const classList = {
                                    left: !block.align_center && !block.align_right,
                                    center: block.align_center,
                                    right: block.align_right,
                                    "valign-top": !block.valign_bottom && !block.valign_middle,
                                    "valign-center": block.valign_middle,
                                    "valign-bottom": block.valign_bottom
                                }
                                if (cell.header) {
                                    return <th colSpan={cell.colspan} rowSpan={cell.rowspan}
                                               className={classList}>{this.parseRichText(cell.text)}</th>
                                } else {
                                    return <td colSpan={cell.colspan} rowSpan={cell.rowspan}
                                               className={classList}>{this.parseRichText(cell.text)}</td>
                                }
                            })}</tr>
                        })}
                    </table>
                    <caption>{this.parseRichText(block.title)}</caption>

                </figure>
            case "pageBlockDetails":
                if (block.open) {
                    return <details open>
                        <summary>{this.parseRichText(block.title)}</summary>
                        {block.blocks.map(b => this.parseBlock(b))}
                    </details>
                } else {
                    return <details>
                        <summary>{this.parseRichText(block.title)}</summary>
                        {block.blocks.map(b => this.parseBlock(b))}
                    </details>
                }
            case "pageBlockRelatedArticles":
                console.log("related", block)
                return <div className="related">
                    <div className="title">{this.parseRichText(block.title)}</div>
                    <div className="articles">{block.articles.map(article => {
                        return <div className="article">
                            <BetterPhotoComponent photo={this.findPhoto(article.photo_id)}/>
                            <div className="article-name">{article.title}</div>
                            <div
                                className="article-description">by {article.author} on {new Date(article.published_date * 1000).toLocaleString("en", {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour12: false,
                                timeZone: "UTC",
                                hour: "numeric",
                                minute: "numeric"
                            })}</div>
                        </div>
                    })}</div>
                </div>
            case "pageBlockMap":
                return <iframe/>

            default:
            case "pageBlockUnsupported":
                console.log("parsing", block)
                return <div css-color="red">Unsupported element</div>
        }
    }

    findPhoto = (photoId) => {
        return this.state.page.photos.filter(_ => _).find(photo => photo.id === photoId)
    }

    render() {
        //console.log(this.state.page)
        return (
            <div css-display={this.state.hidden && "none"} className={["instant-view-wrapper", this.state.hidden ? "hidden" : ""]}>
                {
                    nodeIf(
                        () => <div class="container">
                            <div className="header" onClick={this.close}>
                                <i className="tgico tgico-back"/>
                                <span>{this.state.page.siteName}</span>
                                <i className="tgico tgico-more"/>
                            </div>


                            <div className="instant-view">
                                <div className="content">
                                    {this.state.page.blocks.map(this.parseBlock)}
                                    <div className="footer">
                                        <div className="views">{this.state.page.views ? (views + " views") : ""}</div>
                                        <div className="feedback">Leave feedback about this preview</div>
                                    </div>
                                </div>
                            </div>
                        </div>,
                        this.state.page
                    )
                }
            </div>
        )
    }

    close = () => {
        this.state.page = null
        if (this.state.history.length > 0) {
            this.state.page = this.state.history.pop()
        }
        if (!this.state.page) {
            this.state.hidden = true
        }
        this.forceUpdate()
    }

    downloadAndOpen = (url) => {
        MTProto.invokeMethod("messages.getWebPage", {
            url: url
        }).then(l => {
            console.log(l)
            this.open(l.cached_page, l.site_name, l.photo)
        })
    }

    open = (page, siteName = "", photo = null) => {
        if (this.state.page !== null) {
            this.state.history.push(this.state.page)
        }
        this.state.hidden = false
        this.state.page = page
        this.state.page.siteName = siteName
        this.state.page.photos.push(photo)
        this.forceUpdate()
    }
}

export default InstantViewComponent