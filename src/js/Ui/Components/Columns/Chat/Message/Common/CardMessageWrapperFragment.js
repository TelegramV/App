import MessageWrapperFragment from "./MessageWrapperFragment";
import TextWrapperComponent from "./TextWrapperComponent";

const CardMessageWrapperFragment = ({message, icon, title, description, bubbleRef, onClick}) => {
    return (
        <MessageWrapperFragment message={message} showUsername={false} bubbleRef={bubbleRef}>
            <div class="card" css-cursor="pointer" onClick={onClick}>
                <div class="card-icon rp rps rp-white" css-border-radius="5px">
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
            </div>
            <TextWrapperComponent message={message}/>
        </MessageWrapperFragment>
    )
}

export default CardMessageWrapperFragment;