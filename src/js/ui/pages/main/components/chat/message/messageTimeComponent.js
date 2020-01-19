const MessageTimeComponent = ({ message, bg = false }) => {
    let classes = "time" + (bg ? " bg" : "");

    let views = "";
    if (message.raw.views) {
        views = (
            <span class="views">
                {numberFormat(message.raw.views)}
                <span class="tgico tgico-channelviews"/>
            </span>
        )
    }

    let edited = message.raw.edit_date ? (<span class="edited">edited</span>) : "";

    return (
        <span class={classes}>
                {views}
            <div class="inner status tgico">
                    {edited}
                {message.getDate('en', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })}
                </div>
            </span>
    )
}

function numberFormat(num) {
    let digits = 1;
    const si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "K" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "B" },
        { value: 1E12, symbol: "T" }
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

export default MessageTimeComponent