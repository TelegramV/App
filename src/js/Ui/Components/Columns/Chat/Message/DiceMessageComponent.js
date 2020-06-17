import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import MessageTimeComponent from "./Common/MessageTimeComponent"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import {StickerManager} from "../../../../../Api/Stickers/StickersManager"
import BetterStickerComponent from "../../../Basic/BetterStickerComponent"

class DiceMessageComponent extends GeneralMessageComponent {
    state = {
        ...super.state,
        sticker: null
    }

    render({message, showDate}, {sticker}) {
        return (
            <MessageWrapperFragment message={message} transparent={true} noPad showDate={showDate}>

                {
                    this.sticker
                        ?
                        <BetterStickerComponent width={200} document={sticker}
                                                autoplay={true}
                                                playOnHover={false}
                                                paused={false}/>
                        :
                        <div css-height={"200px"}/>
                }

                <MessageTimeComponent message={message} bg={true}/>

            </MessageWrapperFragment>
        )
    }

    componentDidMount() {
        this.assure(StickerManager.getDice(this.props.message.value, this.props.message.emoji)).then(sticker => {
            this.setState({
                sticker
            });
        })
    }

    componentWillUpdate(nextProps) {
        if (this.props.message.emoji !== nextProps.message.emoji) {
            this.assure(StickerManager.getDice(nextProps.message.value, nextProps.message.emoji)).then(sticker => {
                this.setState({
                    sticker
                });
            })
        }
    }
}

export default DiceMessageComponent
