
import VRDOMTextInterceptor from "../../V/VRDOM/plugin/VRDOMTextInterceptor"

// WIP | DOESN'T WORK, WE NEED TO EXTEND JSX PARSER TO MAKE IT WORK WITH BETTER PERFORMANCE THAN TWEMOJI

var twemoji = {
        base: 'https://twemoji.maxcdn.com/v/$VERSION/',
        ext: '.png',
        size: '72x72',
        className: 'emoji',
        convert: {
            fromCodePoint: String.fromCodePoint,
        },

    },
    re = /twemoji/,
    UFE0Fg = /\uFE0F/g,
    U200D = String.fromCharCode(0x200D);

function replace(text, callback) {
    return String(text).replace(re, callback);
}

function toCodePoint(unicodeSurrogates, sep) {
    var r = [],
        c = 0,
        p = 0,
        i = 0;

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

function parseString(str, options) {
    let allText = str,
        length = allText.length,
        modified,
        text,
        match,
        i,
        index,
        img,
        rawText,
        iconId,
        src;

    const nodes = []

    while (length--) {
        modified = false;
        text = allText[length];
        i = 0;

        while ((match = re.exec(text))) {
            index = match.index;
            if (index !== i) {
                nodes.push(text.slice(i, index))
            }

            rawText = match[0];
            iconId = grabTheRightIcon(rawText);
            i = index + rawText.length;
            src = options.callback(iconId, options);

            if (iconId && src) {
                img = <img className={options.className}
                           draggable="false"
                           alt={rawText}
                           src={src}
                           {...options.attributes(rawText, iconId)}/>
                modified = true;
            }

            if (!img) return rawText
        }

        if (modified) {
            if (i < text.length) {
                nodes.push(text.slice(i))
            }
        }

        nodes.push(img)
    }

    return nodes;
}

function toSizeSquaredAsset(value) {
    return typeof value === 'number' ?
        value + 'x' + value :
        value;
}

function parse(what, how) {
    if (!how || typeof how === 'function') {
        how = {callback: how};
    }
    // if first argument is string, inject html <img> tags
    // otherwise use the DOM tree and parse text nodes only
    return parseString(what, {
        callback: how.callback || defaultImageSrcGenerator,
        attributes: typeof how.attributes === 'function' ? how.attributes : returnNull,
        base: typeof how.base === 'string' ? how.base : twemoji.base,
        ext: how.ext || twemoji.ext,
        size: how.folder || toSizeSquaredAsset(how.size || twemoji.size),
        className: how.className || twemoji.className,
        onerror: how.onerror || twemoji.onerror
    });
}

function defaultImageSrcGenerator(icon, options) {
    return ''.concat(options.base, options.size, '/', icon, options.ext);
}


class EmojiTextInterceptor extends VRDOMTextInterceptor {
    interceptRender(text: string): any {
        if (!text) {
            return text;
        }

        return parse(text, {
            callback: (icon, options) => {
                // if (isApple) return "#"; //cause error to not download emoji on Apple devices

                //there's a difference between twemoji and apple codes
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
                return ''.concat(
                    options.base,
                    options.size,
                    '/',
                    icon,
                    options.ext
                );
            },
            attributes: () => null,
            base: twemoji.base,
            ext: twemoji.ext,
            size: toSizeSquaredAsset(twemoji.size),
            className: twemoji.className,
            onerror: twemoji.onerror
        });
    }
}

export default EmojiTextInterceptor;