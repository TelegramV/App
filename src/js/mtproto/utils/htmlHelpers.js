function insertAt(str, position, length, b) {
    return [str.slice(0, position), b, str.slice(position + length)].join('')
}

export function parseMessageEntities(text, messageEntities) {
    if(!messageEntities)
        return text
    const handlers = {
        messageEntityMention: (l, a) => `<a href="#">${a}</a>`,
        messageEntityHashtag: (l, a) => `<a href="#">${a}</a>`,
        messageEntityBotCommand: (l, a) => `<a href="#">${a}</a>`,
        messageEntityUrl: (l, a) => `<a href="${a}">${a}</a>`,
        messageEntityEmail: (l, a) => `<a href="mailto:${a}">${a}</a>`,

        messageEntityBold: (l, a) => `<b>${a}</b>`,
        messageEntityItalic: (l, a) => `<i>${a}</i>`,
        messageEntityCode: (l, a) => `<pre>${a}</pre>`,
        messageEntityPre: (l, a) => `<pre>${a}</pre>`,
        messageEntityTextUrl: (l, a) => `<a href="${l.url}">${a}</a>`, // TODO can be problems when there's " symbol isnide. should be fixed!
        messageEntityMentionName: (l, a) => `<a>${a}</a>`,
        inputMessageEntityMentionName: (l, a) => `<a>${a}</a>`,
        messageEntityPhone: (l, a) => `<a href="tel:${a}">${a}</a>`,
        messageEntityCashtag: (l, a) => `<a href="#">${a}</a>`,
        messageEntityUnderline: (l, a) => `<u>${a}</u>`,
        messageEntityStrike: (l, a) => `<s>${a}</s>`,
        messageEntityBlockquote: (l, a) => `<blockquote>${a}</blockquote>`

    }
    let globalOffset = 0
    messageEntities.forEach(l => {
        const offset = l.offset + globalOffset
        const length = l.length
        const handler = handlers[l._]
        if(!handler) return
        const result = handlers[l._](l, text.substr(offset, length))
        console.log(result)
        const before = text
        console.log(l, "BEFORE", text)
        text = insertAt(text, offset, length, result)
        globalOffset += text.length - before.length
        console.log("AFTER", text, globalOffset)
    })
    return text
}