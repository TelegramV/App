import MessageWrapperFragment from "./MessageWrapperFragment";
import MessageTimeComponent from "./MessageTimeComponent";
import TextWrapperComponent from "./TextWrapperComponent";

const CardMessageWrapperComponent = ({message, icon, title, description}) => {
    let text = message.text;
    return (
        <MessageWrapperFragment message={message}>
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
        </MessageWrapperFragment>
    )
}

export default CardMessageWrapperComponent;