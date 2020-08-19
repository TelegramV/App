import MessageTimeComponent from "./MessageTimeComponent";

const TextWrapperComponent = ({message, time = true, color, big=false, transparent=false}, slot) => {
    let text = message.parsed;
    if (!text) return "";
    let classes = {
    	"text-wrapper": true,
    	"empty": text.length === 0,
        "big": big,
    }
    return (
        <div class={classes} css-color={color} ondblclick={event => event.stopPropagation()}>
            {text}
            {slot}
            {time ? <MessageTimeComponent color={color} message={message} bg={transparent}/> : ""}
        </div>
    )
}

export default TextWrapperComponent