import MessageWrapperComponent from "./messageWrapperComponent";
import MessageTimeComponent from "./messageTimeComponent";

const CardMessageComponent = ({ message, icon, title, description }) => {
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
					<MessageTimeComponent message={message}/>
				</div>
			</div>
		</MessageWrapperComponent>
    )
}

export default CardMessageComponent;