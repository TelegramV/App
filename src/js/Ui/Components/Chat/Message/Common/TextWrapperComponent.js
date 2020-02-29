import {parseMessageEntities} from "../../../../../Utils/htmlHelpers";
import MessageTimeComponent from "./MessageTimeComponent";

const TextWrapperComponent = ({message, time = true, slot}) => {
    let text = parseMessageEntities(message.text, message.raw.entities);
    if (!text) return "";
    return (
        <div class="text-wrapper">
            {text}
            {slot}
            {time ? <MessageTimeComponent message={message}/> : ""}
        </div>
    )
}

export default TextWrapperComponent