import MTProto from "../../../../../MTProto/external";
import VComponent from "../../../../../V/VRDOM/component/VComponent"


export class InlineKeyboardComponent extends VComponent {
    static parseButton(message, button) {
        const loader = <progress className="progress-circular white disabled"/>
        const handlers = {
            "keyboardButton": l => <div className="button rp rps"
                                        onClick={q => this.callbackButton(message, q.target, l.text)}>{l.text}{loader}</div>,
            "keyboardButtonUrl": l => <a className="button rp rps link" href={l.url}
                                         target="_blank">{l.text}{loader}</a>,
            "keyboardButtonCallback": l => <div className="button rp rps"
                                                onClick={q => this.callbackButton(message, q.target, l.data)}>{l.text}{loader}</div>,
            "keyboardButtonRequestPhone": l => <div className="button rp rps"
                                                    onClick={this.requestPhone}>{l.text}{loader}</div>,
            "keyboardButtonRequestGeoLocation": l => <div className="button rp rps"
                                                          onClick={this.requestGeo}>{l.text}{loader}</div>,
            "keyboardButtonSwitchInline": l => <div className="button rp rps switch-inline"
                                                    onClick={_ => this.switchInline(l)}>{l.text}{loader}</div>,
            "keyboardButtonGame": l => <div className="button rp rps"
                                            onClick={q => this.startGame(message, q.target)}>{l.text}{loader}</div>,
            "keyboardButtonBuy": l => <div className="button rp rps" onClick={this.buy}>{l.text}{loader}</div>,
            "keyboardButtonUrlAuth": l => <div className="button rp rps"
                                               onClick={_ => this.auth(l)}>{l.text}{loader}</div>
        }
        return handlers[button._](button)
    }

    static callbackButton(message, target, bytes, isGame = false) {
        const progress = target.querySelector("progress")
        progress.classList.remove("disabled")
        return MTProto.invokeMethod("messages.getBotCallbackAnswer", {
            data: isGame ? undefined : bytes,
            game: isGame,
            peer: message.to.inputPeer,
            msg_id: message.id,
        }).then(l => {
            //if(l.message) alert(l.message)

            return l
        }, error => {
        }).finally(l => {
            progress.classList.add("disabled")
        })
    }

    static requestPhone() {

    }

    static requestGeo() {

    }

    static switchInline(l) {

    }

    static startGame(message, target) {
        this.callbackButton(message, target, undefined, true).then(l => {
            if (l.has_url) {
                window.open(l.url)
            }
        })
    }

    static buy() {

    }

    static auth(l) {

    }

    render() {
        const message = this.props.message
        return <div className="inline-keyboard">
            {message.replyMarkup.rows.map(l => {
                return <div className="row">
                    {l.buttons.map(q => {
                        return InlineKeyboardComponent.parseButton(message, q)
                    })}
                </div>
            })}
        </div>
    }
}