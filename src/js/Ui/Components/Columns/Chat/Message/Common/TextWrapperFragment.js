import MessageTimeFragment from "./MessageTimeFragment";

const TextWrapperFragment = ({message, time = true, color, big = false, transparent = false}, slot) => {
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
            {time ? MessageTimeFragment({color, message, bg: transparent}) : ""}
        </div>
    );
};

export default TextWrapperFragment;