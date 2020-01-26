import AppEvents from "../../../../../api/eventBus/AppEvents"
import {isElementInViewport} from "../../../../utils/index"

import MessageComponent from "./../../messages/newMessage"
import Component from "../../../../v/vrdom/component"
import VRDOM from "../../../../v/vrdom"
import {vrdom_deepDeleteRealNodeInnerComponents} from "../../../../v/vrdom/patch"
import {MessageType} from "../../../../../api/dataObjects/messages/Message"
import AppSelectedPeer from "../../../../reactive/SelectedPeer"
import {FileAPI} from "../../../../../api/fileAPI"
import MTProto from "../../../../../mtproto"


const MessageComponentGeneral = message => <MessageComponent message={message}/>

class BubblesComponent extends Component {
    constructor(props) {
        super(props)

        this.reactive = {
            peer: AppSelectedPeer.Reactive.FireOnly,
        }

        this.state = {
            renderedMessages: new Map(),
            isFetchingNextPage: false,
            isFetching: false,
            messagesWaitingForRendering: new Set()
        }

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

            if (dialog && AppSelectedPeer.check(dialog.peer)) {
                if (event.type === "fetchedInitialMessages") {

                    this._appendMessages(event.messages)

                } else if (event.type === "fetchedMessagesNextPage") {

                    this._appendMessages(event.messages)

                } else if (event.type === "newMessage") {
                    if (!this.state.isFetching) {
                        if (isElementInViewport(this._prependMessages([event.message])[0])) {
                            this._markAllAsRead()
                        }
                    } else {
                        this.state.messagesWaitingForRendering.add(event.message)
                    }
                }
            }
        })
    }

    reactiveChanged(key, value) {
        // check if selected peer was changed
        if (key === "peer") {
            if (value) {
                if (!this.reactive.peer.full) {
                    this.reactive.peer.fetchFull()
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
     * @return {Element|Node|boolean}
     */
    _renderMessage(message, prepend = false) {

        if (this.state.renderedMessages.has(message.id)) {
            return false
        }

        const $mount = prepend ? VRDOM.prepend : VRDOM.append

        let $message = undefined

        $message = $mount(MessageComponentGeneral(message), this.elements.$bubblesInner); //TODO Давид поправ як має бути

        if (message.media) {
            if (message.media.webpage && message.media.webpage.photo) {
                // FileAPI.photoThumbnail(message.media.webpage.photo, data => {
                //     message.media.webpage.photo.real = {
                //         url: data.src
                //     }
                //     VRDOM.patch($message, MessageComponentGeneral(message));
                // })
            }
            if (message.media.document) {
                if (message.type === MessageType.STICKER || message.type === MessageType.ANIMATED_EMOJI) {
                    FileAPI.getFile(message.media.document).then(data => {
                        message.media.document.real = {url: data};
                        VRDOM.patch($message, MessageComponentGeneral(message));
                    });
                }
                if (message.type === MessageType.ROUND || message.type === MessageType.VIDEO || message.type === MessageType.AUDIO) {
                    // FileAPI.getFile(message.media.document, "").then(data => {
                    //     message.media.document.real = {url: data};
                    //     VRDOM.patch($message, MessageComponentGeneral(message));
                    // });
                }
            }
            if (message.media.game) {
                //Отримуємо лінк
                //Отримуємо прев'ю
                //Отримуємо велику картинку
                // MTProto.invokeMethod("messages.getBotCallbackAnswer", {
                //     flags: 2,
                //     peer: message.from.inputPeer,
                //     msg_id: message.id
                // }).then(data => {
                //     message.media.game.real = {
                //         url: data.url
                //     }
                //     VRDOM.patch($message, MessageComponentGeneral(message));
                //     FileAPI.photoThumbnail(message.media.game.photo, data => {
                //         message.media.game.photo.real = {
                //             url: data.src
                //         }
                //         VRDOM.patch($message, MessageComponentGeneral(message));
                //         //immediatly tring to get better image
                //         FileAPI.getFile(message.media.game.photo, "x").then(data => {
                //         FileAPI.getFile(message.media.game.photo, "x").then(data => {
                //             message.media.game.photo.real = {url: data};
                //             VRDOM.patch($message, MessageComponentGeneral(message));
                //         });
                //     })
                // })
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
        let z = 0

        for (const message of messages) {
            const $rendered = this._renderMessage(message)

            if ($rendered) {
                this.state.renderedMessages.set(message.id, $rendered)
            }
            // z += this.elements.$bubblesInner.clientHeight - k
        }
        // this.$el.scrollTop += z
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
            const $rendered = this._renderMessage(message, true)

            if ($rendered) {
                this.state.renderedMessages.set(message.id, $rendered)
            }

            pushed.push($rendered)
        }

        if (reset) {
            this.$el.scrollTop = this.elements.$bubblesInner.clientHeight
        }

        return pushed
    }

    _refreshMessages() {
        this.state.isFetching = true
        this._toggleMessagesLoader(false)
        this._clearBubbles()

        this.reactive.peer.api.fetchInitialMessages().then(messages => {
            this._toggleMessagesLoader(true)
            this.state.isFetching = false
            this.state.messagesWaitingForRendering.forEach(message => {
                this._prependMessages([message])
            })
            this.state.messagesWaitingForRendering.clear()
        })
    }

    _clearBubbles() {
        this.state.renderedMessages.clear()

        vrdom_deepDeleteRealNodeInnerComponents(this.elements.$bubblesInner)
    }

    _markAllAsRead() {
        // if (this.reactive.peer) {
        return this.reactive.peer.api.readAllHistory()
        // }
    }

    _onScrollBubbles(event) {
        const $element = event.target
        const $bi = this.elements.$bubblesInner

        if ($element.scrollTop === 0 && !this.state.isFetchingNextPage) {
            this.state.isFetchingNextPage = true

            this._toggleMessagesLoader(false)

            this.reactive.peer.api.fetchNextPage().then(() => {
                this.state.isFetchingNextPage = false
                this._toggleMessagesLoader(true)
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