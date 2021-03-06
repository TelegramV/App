import {ChatInputManager} from "../../ChatInput/ChatInputComponent"

const MessageTimeFragment = ({message, bg = false, color}) => {
    let classes = "time" + (bg ? " bg" : "");
    const ondblclick = () => ChatInputManager.replyTo(message)

    let views = "";
    if (message.raw.views) {
        views = (
            <span ondblclick={ondblclick} class="views" css-color={color}>
                {numberFormat(message.raw.views)}
                <span class="tgico tgico-channelviews"/>
            </span>
        )
    }

    let edited = message.editDate ? (<span ondblclick={ondblclick} class="edited">edited</span>) : "";

    return (
        <span ondblclick={ondblclick} class={classes}>
            {!bg ? views : ""}
            <div class="inner status tgico" css-color={color}>
            	{bg ? views : ""}
                {edited}
                {message.getFormattedTime()}
                </div>
            </span>
    )
}

function numberFormat(num) {
    let digits = 1;
    const si = [
        {value: 1, symbol: ""},
        {value: 1E3, symbol: "K"},
        {value: 1E6, symbol: "M"},
        {value: 1E9, symbol: "B"},
        {value: 1E12, symbol: "T"}
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

export default MessageTimeFragment