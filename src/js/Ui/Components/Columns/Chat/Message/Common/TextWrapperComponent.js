import MessageTimeComponent from "./MessageTimeComponent";

const TextWrapperComponent = ({message, time = true, color, big = false, transparent = false}, slot) => {
    let text = message.parsed;

    if (!text) {
        return "";
    }

    return (
        <div class={{
            "text-wrapper": true,
            "empty": text.length === 0,
            "big": big,
        }} css-color={color} ondblclick={event => event.stopPropagation()}>
            {text}
            {slot}
            {time ? MessageTimeComponent({color, message, bg: transparent}) : ""}
        </div>
    );
};

export default TextWrapperComponent;