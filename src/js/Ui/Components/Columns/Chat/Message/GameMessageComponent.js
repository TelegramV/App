import MessageWrapperFragment from "./Common/MessageWrapperFragment"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import BetterPhotoComponent from "../../../Basic/BetterPhotoComponent"

class GameMessageComponent extends GeneralMessageComponent {

    render() {
        let game = this.props.message.raw.media.game

        //DRAFT VERSION
        return (
            <MessageWrapperFragment message={this.props.message} showUsername={false} avatarRef={this.avatarRef}
                                    bubbleRef={this.bubbleRef}>
                <div class="game">
                    <div class="title">{game.title}</div>
                    <div class="info">
                        {this.props.message.text ? this.props.message.parsed : game.description}
                    </div>
                    <BetterPhotoComponent photo={game.photo} calculateSize={true}/>
                </div>
            </MessageWrapperFragment>
        )
    }
}

export default GameMessageComponent