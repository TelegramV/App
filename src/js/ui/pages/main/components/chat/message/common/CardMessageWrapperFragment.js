import MessageWrapperFragment from "./MessageWrapperFragment";
import MessageTimeComponent from "./MessageTimeComponent";
import TextWrapperComponent from "./TextWrapperComponent";

const CardMessageWrapperFragment = ({message, icon, title, description, bubbleRef, onClick}) => {
    let text = message.text;
    return (
        <MessageWrapperFragment message={message} showUsername={false} bubbleRef={bubbleRef}>
            <div class="card" css-cursor="pointer" onClick={onClick}>
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

export default CardMessageWrapperFragment;