import MessageWrapperComponent from "./MessageWrapperComponent";
import MessageTimeComponent from "./MessageTimeComponent";
import TextWrapperComponent from "./TextWrapperComponent";

const CardMessageWrapperComponent = ({message, icon, title, description}) => {
    let text = message.text;
    return (
        <MessageWrapperComponent message={message}>
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
                {!text ? <MessageTimeComponent message={message}/> : ""}
            </div>
            {text ? <TextWrapperComponent message={message}/> : ""}
        </MessageWrapperComponent>
    )
}

export default CardMessageWrapperComponent;