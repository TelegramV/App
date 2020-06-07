import MessageTimeComponent from "./MessageTimeComponent";

const TextWrapperComponent = ({message, time = true, color}, slot) => {
    let text = message.parsed;
    if (!text) return "";
    let classes = {
    	"text-wrapper": true,
    	"empty": text.length === 0
    }
    return (
        <div class={classes} css-color={color} ondblclick={event => event.stopPropagation()}>
            {text}
            {slot}
            {time ? <MessageTimeComponent color={color} message={message}/> : ""}
        </div>
    )
}

export default TextWrapperComponent