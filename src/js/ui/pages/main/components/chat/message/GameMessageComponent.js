import MessageWrapperComponent from "./common/MessageWrapperComponent"
import {PhotoComponent} from "../../basic/photoComponent";
import GeneralMessageComponent from "./common/GeneralMessageComponent"
import {parseMessageEntities} from "../../../../../../mtproto/utils/htmlHelpers"

class GameMessageComponent extends GeneralMessageComponent {

    h() {
        let game = this.message.raw.media.game

        //DRAFT VERSION
        return (
            <MessageWrapperComponent message={this.message}>
                <div class="game">
                    <div class="title">{game.title}</div>
                    <div class="info">
                        {this.message.text ? parseMessageEntities(this.message.text) : game.description}
                    </div>
                    <PhotoComponent photo={game.photo}/>
                </div>
            </MessageWrapperComponent>
        )
    }
}

export default GameMessageComponent