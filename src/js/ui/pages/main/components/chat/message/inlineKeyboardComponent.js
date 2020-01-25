import Component from "../../../../../framework/vrdom/component";
import MTProto from "../../../../../../mtproto";


export class InlineKeyboardComponent extends Component {
    constructor(props) {
        super(props);

    }

    h() {
        const message = this.props.message
        return <div className="inline-keyboard">
            {message.replyMarkup.rows.map(l => {
                return <div className="row">
                    {l.buttons.map(q => {
                        return this.parseButton(q)
                    })}
                </div>
            })}
        </div>
    }

    parseButton(button) {
        const loader = <progress className="progress-circular white disabled"/>
        const handlers = {
            "keyboardButton": l => <div className="button rp rps" onClick={q => this.callbackButton(q.target, l.text)}>{l.text}{loader}</div>,
            "keyboardButtonUrl": l => <a className="button rp rps link" href={l.url} target="_blank">{l.text}{loader}</a>,
            "keyboardButtonCallback": l => <div className="button rp rps" onClick={q => this.callbackButton(q.target, l.data)}>{l.text}{loader}</div>,
            "keyboardButtonRequestPhone": l => <div className="button rp rps" onClick={this.requestPhone}>{l.text}{loader}</div>,
            "keyboardButtonRequestGeoLocation": l => <div className="button rp rps" onClick={this.requestGeo}>{l.text}{loader}</div>,
            "keyboardButtonSwitchInline": l => <div className="button rp rps" onClick={_ => this.switchInline(l)}>{l.text}{loader}</div>,
            "keyboardButtonGame": l => <div className="button rp rps" onClick={q => this.startGame(q.target)}>{l.text}{loader}</div>,
            "keyboardButtonBuy": l => <div className="button rp rps" onClick={this.buy}>{l.text}{loader}</div>,
            "keyboardButtonUrlAuth": l => <div className="button rp rps" onClick={_ => this.auth(l)}>{l.text}{loader}</div>
        }
        return handlers[button._](button)
    }

    callbackButton(target, bytes, isGame = false) {
        const progress = target.querySelector("progress")
        progress.classList.remove("disabled")
        return MTProto.invokeMethod("messages.getBotCallbackAnswer", {
            pFlags: {
                data: isGame ? undefined : bytes,
                game: isGame
            },
            peer: this.props.message.to.inputPeer,
            msg_id: this.props.message.id,
        }).then(l => {
            //if(l.message) alert(l.message)

            return l
        }, error => {
        }).finally(l => {
            progress.classList.add("disabled")
        })
    }

    requestPhone() {

    }

    requestGeo() {

    }

    switchInline(l) {

    }

    startGame(target) {
        this.callbackButton(target, undefined, true).then(l => {
            if(l.pFlags.has_url) {
                window.open(l.url)
            }
        })
    }

    buy() {

    }

    auth(l) {

    }
}