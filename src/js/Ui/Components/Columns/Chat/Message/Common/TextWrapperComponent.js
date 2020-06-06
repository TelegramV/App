import MessageTimeComponent from "./MessageTimeComponent";

const TextWrapperComponent = ({message, time = true, color}, slot) => {
    let text = message.parsed;
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