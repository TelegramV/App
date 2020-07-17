import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import { StickerManager } from "../../../../../Api/Stickers/StickersManager"
import BetterStickerComponent from "../../../Basic/BetterStickerComponent"
import UIEvents from "../../../../EventBus/UIEvents"
import VButton from "../../../../Elements/Button/VButton"
import AppSelectedChat from "../../../../Reactive/SelectedChat"

class DiceMessageComponent extends GeneralMessageComponent {
    state = {
        ...super.state,
        sticker: null
    }

    render({ message, showDate }, { sticker }) {
        return (
            <MessageWrapperFragment message={message} transparent={true} noPad showDate={showDate}>

                {
                    (this.state.sticker ? 
                        <BetterStickerComponent width={200*0.625 /*TODO get that ratio from TG settings*/} document={sticker}
                                                autoplay={true}
                                                playOnHover={false}
                                                paused={false}
                                                onClick={this.suggestToSend}/>
                        :
                        <div css-height={"125px"}/>)
                }

                <MessageTimeComponent message={message} bg={true}/>

            </MessageWrapperFragment>
        )
    }

    componentDidMount() {
        this.assure(StickerManager.getDice(this.props.message.value, this.props.message.emoji)).then(sticker => {
            this.setState({
                sticker: sticker
            });
        })
    }

    componentWillUpdate(nextProps) {
        if (this.props.message.emoji !== nextProps.message.emoji || this.props.message.value !== nextProps.message.value) {
            this.assure(StickerManager.getDice(nextProps.message.value, nextProps.message.emoji)).then(sticker => {
                this.setState({
                    sticker: sticker
                });
            })
        }
    }

    suggestToSend = () => {
        UIEvents.General.fire("snackbar.show", {text: <SnackbarSuggestion emoji={this.props.message.emoji}/>, time: 5});
    }
}

const SnackbarSuggestion = ({emoji}) => {
    let chat = AppSelectedChat.current;
    return (
        <div class="emoji-suggestion">
            Send a {emoji} emoji to any chat to try your luck.
            <span class="send-button" onClick={_ => chat.api.sendDice(emoji)}>SEND</span>
        </div>
        )
}

export default DiceMessageComponent