import {parseMessageEntities} from "../../../../../../Utils/htmlHelpers";
import MessageTimeComponent from "./MessageTimeComponent";

const TextWrapperComponent = ({message, time = true, color}, slot) => {
    let text = parseMessageEntities(message.text, message.raw.entities);
    if (!text) return "";
    return (
        <div class="text-wrapper" css-color={color} ondblclick={event => event.stopPropagation()}>
            {text}
            {slot}
            {time ? <MessageTimeComponent color={color} message={message}/> : ""}
        </div>
    )
}

export default TextWrapperComponent