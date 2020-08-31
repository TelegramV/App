import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import GeneralMessageComponent from "./Common/GeneralMessageComponent";
import BetterPhotoComponent from "../../../Basic/BetterPhotoComponent";

class GameMessageComponent extends GeneralMessageComponent {

    render({showDate}) {
        let game = this.props.message.raw.media.game;

        return (
            MessageWrapperFragment(
                {message, showDate, showUsername: false},
                <>
                    <div className="game">
                        <div className="title">{game.title}</div>
                        <div className="info">
                            {this.props.message.text ? this.props.message.parsed : game.description}
                        </div>
                        <BetterPhotoComponent photo={game.photo} calculateSize={true}/>
                    </div>
                </>
            )
        );
    }
}

export default GameMessageComponent;