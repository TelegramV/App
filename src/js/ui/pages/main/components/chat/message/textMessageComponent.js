import {parseMessageEntities} from "../../../../../../mtproto/utils/htmlHelpers"
import MessageWrapperComponent from "./messageWrapperComponent"
import MessageTimeComponent from "./messageTimeComponent"
import TextWrapperComponent from "./textWrapperComponent";



const TextMessageComponent = ({ message }) => {
    const username = message.from.name && !message.isPost && !message.isOut;
    return (
        <MessageWrapperComponent message={message}>
            {username ? <div className="username">{message.from.name}</div> : ""}
            <div className="message">
                <TextWrapperComponent message={message}/>
            </div>
        </MessageWrapperComponent>
    )
}

export default TextMessageComponent