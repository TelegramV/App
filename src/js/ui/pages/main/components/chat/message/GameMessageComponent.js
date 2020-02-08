import MessageWrapperFragment from "./common/MessageWrapperFragment"
import {PhotoComponent} from "../../basic/photoComponent";
import GeneralMessageComponent from "./common/GeneralMessageComponent"
import {parseMessageEntities} from "../../../../../../mtproto/utils/htmlHelpers"

class GameMessageComponent extends GeneralMessageComponent {

    h() {
        let game = this.message.raw.media.game

        //DRAFT VERSION
        return (
            <MessageWrapperFragment message={this.message} showUsername={false} avatarRef={this.avatarRef} bubbleRef={this.bubbleRef}>
                <div class="game">
                    <div class="title">{game.title}</div>
                    <div class="info">
                        {this.message.text ? parseMessageEntities(this.message.text) : game.description}
                    </div>
                    <PhotoComponent photo={game.photo}/>
                </div>
            </MessageWrapperFragment>
        )
    }
}

export default GameMessageComponent