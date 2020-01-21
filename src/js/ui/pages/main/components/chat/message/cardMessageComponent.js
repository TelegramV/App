import MessageWrapperComponent from "./messageWrapperComponent";
import MessageTimeComponent from "./messageTimeComponent";
import TextWrapperComponent from "./textWrapperComponent";

const CardMessageComponent = ({ message, icon, title, description }) => {
	let text = message.text;
    return (
        <MessageWrapperComponent message={message}>
			<div class="message">
				<div class="card">
					<div class="card-icon">
						{icon}
					</div>
					<div class="card-info">
						<div class="title">
						{title}
						</div>
						<div class="description">
						{description}
						</div>
					</div>
					{!text?<MessageTimeComponent message={message}/>: ""}
				</div>
				{text?<TextWrapperComponent message={message}/>:""}
			</div>
		</MessageWrapperComponent>
    )
}

export default CardMessageComponent;