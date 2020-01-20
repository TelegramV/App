import AppSelectedDialog from "../../../../../api/dialogs/selectedDialog"
import AppEvents from "../../../../../api/eventBus/appEvents"
import { FileAPI } from "../../../../../api/fileAPI"
import { isElementInViewport } from "../../../../framework/utils"

import Message from "./../../messages/newMessage"
import Component from "../../../../framework/vrdom/component"
import VRDOM from "../../../../framework/vrdom"


class BubblesComponent extends Component {
    constructor() {
        super({
            reactive: {
                dialog: AppSelectedDialog.Reactive.FireOnly,
            },

            state: {
                /**
                 * @var {Array<Node|Element>|[]} renderedMessageElements
                 */
                renderedMessageElements: [],
                isFetchingNextPage: false,
            },
        })

        this.elements = {
            $bubblesInner: undefined,
            $loader: undefined,
        }
    }


    h() {
        return (
            <div id="bubbles" onScroll={this._onScrollBubbles}>
                <div id="bubbles-inner">

                </div>
            </div>
        )
    }

    mounted() {
        this.elements.$bubblesInner = this.$el.querySelector("#bubbles-inner")
        this.elements.$loader = this.$el.parentElement.querySelector("#messages-wrapper-messages-loader")

        AppEvents.Dialogs.subscribeAny(event => {
            const dialog = event.dialog

            if (AppSelectedDialog.check(dialog)) {
                if (event.type === "fetchedInitialMessages") {
                    this._appendMessages(event.messages)
                } else if (event.type === "fetchedMessagesNextPage") {
                    this._appendMessages(event.messages)
                } else if (event.type === "newMessage") {
                    if (isElementInViewport(this._prependMessages([event.message])[0])) {
                        this._markAllAsRead()
                    }
                } else {

                }
            }
        })
    }

    reactiveChanged(key, value) {
        // check if selected dialog was changed
        if (key === "dialog") {
            if (value) {
                if (!this.reactive.dialog.peer.full) {
                    this.reactive.dialog.peer.fetchFull()
                }

                this._markAllAsRead()
                this._refreshMessages()
            } else {
                this._clearBubbles()
            }
        }
    }

    /**
     * TODO: REWRITE!!!!
     *
     * @param {Message} message
     * @param prepend
     * @private
     * @return {Element|Node}
     */
    _renderMessage(message, prepend = false) {

        const $mount = prepend ? VRDOM.prepend : VRDOM.append
        let $message = undefined
        $message = $mount(<Message message={message}/>, this.elements.$bubblesInner); //TODO Давид поправ як має бути
        if (message.media) {
            if (message.media.photo) {

                // я зробив щоб качало мінімальний розмір фоток, щоб менше напрягалось
                // більший можна буде показувати при кліку

                console.log(message.media.photo)
                const max = FileAPI.getMaxSize(message.media.photo)
                const thumbnail = FileAPI.getThumbnail(message.media.photo)
                message.media.photo.real = {
                    src: thumbnail,
                    sizes: [max.w, max.h],
                    thumbnail: true
                }

                VRDOM.patch($message, <Message message={message}/>);

                FileAPI.getFile(message.media.photo, max.type).then(file => {
                    message.media.photo.real = {
                        src: file,
                        sizes: [max.w, max.h],
                        thumbnail: false
                    }
                    VRDOM.patch($message, <Message message={message}/>);
                })
            }
            if (message.media.webpage && message.media.webpage.photo) {
                FileAPI.photoThumbnail(message.media.webpage.photo, data => {
                    message.media.webpage.photo.real = {
                        url: data.src
                    }
                    VRDOM.patch($message, <Message message={message}/>);
                })
            }
            if (message.media.document) {
                if (message.type == "sticker") {
                    FileAPI.getFile(message.media.document, "application/x-tgsticker").then(data => {
                        message.media.document.real = { url: data };
                        VRDOM.patch($message, <Message message={message}/>);
                    });
                }
                if (message.type == "round" || message.type=="video" || message.type=="audio") {
                    FileAPI.getFile(message.media.document, "").then(data => {
                        message.media.document.real = { url: data };
                        VRDOM.patch($message, <Message message={message}/>);
                    });
                }
            }
        }
        /*if (message.media) {
            if (message.media.photo) {
                $message = $mount(<ImageMessageComponent message={message} image={false}/>, this.elements.$bubblesInner)

                FileAPI.photoThumnail(message.media.photo, data => {
                    VDOM.patchReal($message, <ImageMessageComponent message={message} image={{
                        imgSrc: data.src,
                        imgSize: data.size,
                        thumbnail: data.thumbnail
                    }}/>)
                })

            } else {
                $message = $mount(<TextMessageComponent message={message}/>, this.elements.$bubblesInner)
            }
        } else {
            $message = $mount(<TextMessageComponent message={message}/>, this.elements.$bubblesInner)
        }*/

        return $message
    }

    /**
     * todo: rewrite this thing
     *
     * @param {Array<Message>} messages
     * @private
     */
    _appendMessages(messages) {
        let k = this.elements.$bubblesInner.clientHeight

        for (const message of messages) {
            this.state.renderedMessageElements.push(this._renderMessage(message))
        }

        this.$el.scrollTop += this.elements.$bubblesInner.clientHeight - k
    }

    /**
     * @param {Array<Message>} messages
     * @private
     */
    _prependMessages(messages) {
        let reset = false

        if (this.elements.$bubblesInner.clientHeight - (this.$el.scrollTop + this.$el.clientHeight) < 50) {
            reset = true
        }

        const pushed = []

        for (const message of messages) {
            // todo sticky date
            // todo push only new
            const rendered = this._renderMessage(message, true)
            this.state.renderedMessageElements.push(rendered)
            pushed.push(rendered)
        }

        if (reset) {
            this.$el.scrollTop = this.elements.$bubblesInner.clientHeight
        }

        return pushed
    }

    _refreshMessages() {
        this._toggleMessagesLoader(false)
        this._clearBubbles()

        this.reactive.dialog.API.fetchInitialMessages().then(messages => {
            this._toggleMessagesLoader(true)
        })
    }

    _clearBubbles() {
        this.state.renderedMessageElements = []

        while (this.elements.$bubblesInner.firstChild) {
            this.elements.$bubblesInner.firstChild.remove()
        }
    }

    _markAllAsRead() {
        return this.reactive.dialog.API.readAllHistory()
    }

    _onScrollBubbles(event) {
        const $element = event.target
        const $bi = this.elements.$bubblesInner

        if ($element.scrollTop === 0 && !this.state.isFetchingNextPage) {
            this.state.isFetchingNextPage = true

            this.reactive.dialog.API.fetchNextPage().then(() => {
                this.state.isFetchingNextPage = false
            })

        } else if ($bi) {
            const minel = $bi.childNodes.length > 10 ? 10 : $bi.childNodes.length

            // if (isElementInViewport($bi.childNodes[minel])) {
            //     this._markAllAsRead()
            // }
        }
    }

    _toggleMessagesLoader(hide = true) {
        if (this.elements.$loader) {
            if (hide) {
                this.elements.$loader.style.display = "none"
            } else {
                this.elements.$loader.style.display = ""
            }
        }
    }
}

export default BubblesComponent