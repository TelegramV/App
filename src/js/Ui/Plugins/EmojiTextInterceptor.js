import * as twemojiRegExp from "twemoji-parser/dist/lib/regex"

const UFE0Fg = /\uFE0F/g;
const U200D = String.fromCharCode(0x200D);

function toCodePoint(unicodeSurrogates, sep) {
    let r = [],
        c = 0,
        p = 0,
        i = 0

    while (i < unicodeSurrogates.length) {
        c = unicodeSurrogates.charCodeAt(i++);
        if (p) {
            r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16));
            p = 0;
        } else if (0xD800 <= c && c <= 0xDBFF) {
            p = c;
        } else {
            r.push(c.toString(16));
        }
    }

    return r.join(sep || '-');
}

function grabTheRightIcon(rawText) {
    return toCodePoint(rawText.indexOf(U200D) < 0 ?
        rawText.replace(UFE0Fg, '') :
        rawText
    );
}

const regExp = twemojiRegExp.default;

function getEmojiUrl(icon) {
    if (icon.length < 4) {
        icon = icon.padStart(4, 0);
    }

    if (icon.endsWith("20e3")) {
        let split = icon.split("-");
        split[0] = split[0].padStart(4, 0);
        split.splice(1, 0, "fe0f");
        icon = split.join("-");
    }

    switch (icon) {
        case "1f441-200d-1f5e8":
            icon = "1f441-fe0f-200d-1f5e8-fe0f";
            break;
    }

    return `./emoji-data/img-apple-64/${icon}.png`;
}

export function text2emoji(text) {
    const nodes = [];

    let i = 0;
    let match;
    while ((match = regExp.exec(text))) {
        const before = text.slice(i, match.index);

        const emoji = match[0];
        const icon = grabTheRightIcon(emoji);
        const src = getEmojiUrl(icon);

        nodes.push(before);

        if (icon && src) {
            nodes.push(
                <img className="emoji"
                     draggable="false"
                     alt={emoji}
                     src={src}
                     onError={event => {
                         const $el = event.currentTarget;
                         const $newEl = document.createElement("div");
                         $newEl.classList.add("emoji");
                         $newEl.classList.add("native");
                         $newEl.textContent = $el.alt;
                         $el.replaceWith($newEl);
                     }}
                />
            );
        } else {
            nodes.push(emoji);
        }

        i = match.index + emoji.length;
    }

    if (i < text.length) {
        nodes.push(text.slice(i));
    }

    return nodes;
}