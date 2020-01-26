/*const REGIONAL_INDICATOR_A = parseInt("1f1e6", 16),
    REGIONAL_INDICATOR_Z = parseInt("1f1ff", 16),
    IMAGE_PATH = "/emoji-data/img-apple-64/",
    IMAGE_EXT = ".png";

function surrogatePairToCodepoint(lead, trail) {
    return (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
}

function getImageForCodepoint(hex) {
    let src = IMAGE_PATH + hex + IMAGE_EXT;
    return <img src={src} class="emoji"/>
}

export function emojiReplace(text) {
    var PATTERN = /([\ud800-\udbff])([\udc00-\udfff])/g;
    if (!text.match(PATTERN)) return <span>{text}</span>

    let replacement = value.replace(PATTERN, function(match, p1, p2) {
        var codepoint = surrogatePairToCodepoint(p1.charCodeAt(0), p2.charCodeAt(0)),
            img = getImageForCodepoint(codepoint.toString(16));
        return img;
    });
    return <span>{replacement}</span>
}

function shouldReplace() {
    return true;
}

export default replaceEmojis(text) {
    if (shouldReplace()) {
        emojiReplace(text);
    }
}*/

let twemoji = require("twemoji");

const replaceEmoji = (element) => {
    return twemoji.default.parse(element, {
        base: "/emoji-data/",
        ext: ".png",
        folder: "img-apple-64"
    })
}

export default replaceEmoji;
