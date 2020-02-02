let twemoji = require("twemoji");

const replaceEmoji = (element) => {
    return twemoji.default.parse(element, {
        base: "./emoji-data/",
        ext: ".png",
        folder: "img-apple-64"
    })
}

export default replaceEmoji;
