import {parseMessageEntities} from "../../../../../../mtproto/utils/htmlHelpers";
import MessageTimeComponent from "./messageTimeComponent";

const TextWrapperComponent = ({ message, time=true, slot}) => {
    let text = parseMessageEntities(message.text, message.entities);
    if (!text) return "";
    return (
        <div class="text-wrapper">
            {text}
            {slot}
            {time?<MessageTimeComponent message={message}/> : ""}
        </div>
    )
}

export default TextWrapperComponent