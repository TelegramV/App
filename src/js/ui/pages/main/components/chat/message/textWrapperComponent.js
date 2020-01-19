import {parseMessageEntities} from "../../../../../../mtproto/utils/htmlHelpers";
import MessageTimeComponent from "./messageTimeComponent";

const TextWrapperComponent = ({ message, slot}) => {
    let text = parseMessageEntities(message.text, message.entities);
    if (!text) return "";
    return (
        <div class="text-wrapper">
            {text}
            {slot}
            <MessageTimeComponent message={message}/>
        </div>
    )
}

export default TextWrapperComponent