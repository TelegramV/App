import MessageWrapperComponent from "./messageWrapperComponent"
import {parseMessageEntities} from "../../../../../../mtproto/utils/htmlHelpers"
import {PhotoComponent} from "../../basic/photoComponent";
const GameMessageComponent = ({message}) => {
	let game = message.media.game;
	//DRAFT VERSION
	return (
		<MessageWrapperComponent message={message}>
			<div class="game">
				<div class="title">{game.title}</div>
				<div class="info">{message.text? parseMessageEntities(message.text) : game.description}</div>
				<PhotoComponent photo={game.photo}/>
			</div>
		</MessageWrapperComponent>
		)
}

export default GameMessageComponent;