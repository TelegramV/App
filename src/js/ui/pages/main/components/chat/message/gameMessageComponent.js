import MessageWrapperComponent from "./messageWrapperComponent"
import {parseMessageEntities} from "../../../../../../mtproto/utils/htmlHelpers"
const GameMessageComponent = ({message}) => {
	let game = message.media.game;
	let photoUrl = game.photo.real ? game.photo.real.url : "";
	let gameUrl = game.real? game.real.url : "";
	//DRAFT VERSION
	return (
		<MessageWrapperComponent message={message}>
			<div class="message">
				<div class="game">
					<div class="title">{game.title}</div>
					<div class="info">{message.text? parseMessageEntities(message.text) : game.description}</div>
					<img class="game-image" src={photoUrl}/> {/*TODO support gifs*/}
					<a href={gameUrl} style="display:block;width:100%;height:50px;background-color:grey;cursor:pointer;line-height:50px;text-align:center" target="_blank">Play</a>
				</div>
			</div>
		</MessageWrapperComponent>
		)
}

export default GameMessageComponent;