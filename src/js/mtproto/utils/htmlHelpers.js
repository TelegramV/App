import AppSelectedInfoPeer from "../../ui/reactive/SelectedInfoPeer"
import PeersStore from "../../api/store/PeersStore"

function insertAt(str, position, length, b) {
    return [str.slice(0, position), b, str.slice(position + length)].join('')
}

/*export function parseMessageEntities(text, messageEntities, noLinks = false) {
    if (!messageEntities)
        return text
    const handlersText = {
        messageEntityBold: (l, a) => VDOM.h("b", { children: a }),
        messageEntityItalic: (l, a) => VDOM.h("i", { children: a }),
        messageEntityCode: (l, a) => VDOM.h("pre", { children: a }),
        messageEntityPre: (l, a) => VDOM.h("pre", { children: a }),
        messageEntityUnderline: (l, a) => VDOM.h("u", { children: a }),
        messageEntityStrike: (l, a) => VDOM.h("s", { children: a }),
        messageEntityBlockquote: (l, a) => VDOM.h("blockquote", { children: a })
    }

    const handlersLinks = {
        messageEntityMention: (l, a) => `<a href="#">${a}</a>`,
        messageEntityHashtag: (l, a) => `<a href="#">${a}</a>`,
        messageEntityBotCommand: (l, a) => `<a href="#">${a}</a>`,
        messageEntityUrl: (l, a) => `<a href="${a}">${a}</a>`,
        messageEntityEmail: (l, a) => `<a href="mailto:${a}">${a}</a>`,

        messageEntityTextUrl: (l, a) => `<a href="${l.url}">${a}</a>`, // TODO can be problems when there's " symbol isnide. should be fixed!
        messageEntityMentionName: (l, a) => `<a>${a}</a>`,
        inputMessageEntityMentionName: (l, a) => `<a>${a}</a>`,
        messageEntityPhone: (l, a) => `<a href="tel:${a}">${a}</a>`,
        messageEntityCashtag: (l, a) => `<a href="#">${a}</a>`,
    }

    const handlers = noLinks ? handlersText : Object.assign({}, handlersText, handlersLinks)
    let globalOffset = 0
    messageEntities.forEach(l => {
        const offset = l.offset + globalOffset
        const length = l.length
        const handler = handlers[l._]
        if (!handler) return
        const result = VDOM.render(handlers[l._](l, text.substr(offset, length)))
        console.log(result)
        const before = text
        console.log(l, "BEFORE", text)
        text = insertAt(text, offset, length, result)
        globalOffset += text.length - before.length
        console.log("AFTER", text, globalOffset)
    })
    return text
}*/

function elemToEntity(elem, offset, length) {
    const handlers = {
        b: "messageEntityBold",
        strong: "messageEntityBold",
        i: "messageEntityItalic",
        sub: "messageEntityCode",
        pre: "messageEntityPre",
        u: "messageEntityUnderline",
        s: "messageEntityStrike",
        strike: "messageEntityStrike",
        blockquote: "messageEntityBlockquote",
        a: l => {
            return {
                _: "messageEntityTextUrl",
                url: l.href
            }
        }
    }

    const tagName = elem.tagName.toLowerCase()
    if (handlers[tagName]) {
        const handler = handlers[tagName]
        let result
        if (typeof handler == "string") {
            result = {
                _: handler
            }
        } else {
            result = handler(elem)
        }
        result.offset = offset
        result.length = length
        return result
    }
}

function getMessageEntities(elem, offset) {
    // console.log("getMessageEntities!", elem.tagName, offset)
    let entities = []
    let from = offset
    elem.childNodes.forEach(l => {
        if (l.nodeType === Node.TEXT_NODE) {
            // console.log("add text!", l.textContent, l.textContent.length)
            offset += l.textContent.length
            return
        }
        let r = getMessageEntities(l, offset)
        // console.log("add offset to", elem.tagName, r.offset, " from ", l.tagName)

        offset = r.offset
        entities.push(...r.entities)
        // console.log(l)
    })
    let length = offset - from
    entities.push(elemToEntity(elem, from, length))
    // console.log(entities)
    return {
        offset: offset,
        entities: entities
    }
}

function addNewlines(elem) {
    elem.childNodes.forEach(l => {
        if(l.tagName && l.tagName.toUpperCase() === "BR") {
            l.parentNode.insertBefore(document.createTextNode("\n"), l)
            l.parentNode.removeChild(l)
            return
        }
        if(l.nodeType !== Node.TEXT_NODE) {
            addNewlines(l)
        }
    })
}

export function domToMessageEntities(elem) {
    addNewlines(elem)
    return {
        messageEntities: getMessageEntities(elem, 0).entities.filter(l => l !== undefined),
        text: elem.textContent
    }
}

function getNewlines(str, ignore = false) {
    if (ignore) {
        return str
    }
    let elements = []
    const splitted = str.split("\n")
    for (let i = 0; i < splitted.length; i++) {
        elements.push(<span>{splitted[i]}</span>)
        if (i !== splitted.length - 1) {
            elements.push(<br/>)
        }
    }
    return elements
}


const handlersText = {
    messageEntityBold: (l, a) => <b>{a}</b>,
    messageEntityItalic: (l, a) => <i>{a}</i>,
    messageEntityCode: (l, a) => <code>{a}</code>,
    messageEntityPre: (l, a) => <code>{a}</code>,
    messageEntityUnderline: (l, a) => <u>{a}</u>,
    messageEntityStrike: (l, a) => <s>{a}</s>,
    messageEntityBlockquote: (l, a) => <blockquote>{a}</blockquote>
}

const handlersLinks = {
    messageEntityMention: (l, a, q) => <a href={`/#/?p=${q}`}>{a}</a>,
    messageEntityHashtag: (l, a) => <a>{a}</a>,
    messageEntityBotCommand: (l, a) => <a>{a}</a>,
    // TODO can be problems when protocol is not specified
    messageEntityUrl: (l, a, q) => <a target="_blank" href={q}>{a}</a>,
    messageEntityEmail: (l, a, q) => <a href={`mailto:${q}`}>{a}</a>,
    messageEntityTextUrl: (l, a) => <a target="_blank" href={l.url}>{a}</a>,
    messageEntityMentionName: (l, a) => <a onClick={e => {
        e.preventDefault()
        AppSelectedInfoPeer.select(PeersStore.get("user", l.user_id))
    }} href={`/#/?p=user.${l.user_id}`}>{a}</a>,
    inputMessageEntityMentionName: (l, a) => <a>{a}</a>,
    messageEntityPhone: (l, a, q) => <a href={`tel:${q}`}>{a}</a>,
    messageEntityCashtag: (l, a) => <a href="#">{a}</a>,
}

function splitMessageEntities(messageEntities) {
    const ranges = []

    messageEntities.forEach(l => {
        const offset = l.offset
        const length = l.length

        const overlapping = ranges.find(q => {
            const lto = l.offset + l.length
            const qto = q.offset + q.length
            const lfrom = l.offset
            const qfrom = q.offset
            return (lto >= qfrom && lto <= qto) || (lto >= qfrom && lto <= qto)
        })
        if(overlapping) {
            overlapping.entities.push(l)

            overlapping.offset = Math.min(overlapping.offset, l.offset)
            const k = overlapping.entities.reduce((z, q) => {
                return z.length + z.offset > q.length + q.offset ? z : q
            })
            overlapping.length = k.offset + k.length - overlapping.offset
            return
        }
        ranges.push({
            offset: offset,
            length: length,
            entities: [l]
        })
    })
    return ranges
}
// TODO fix multiple entities overlap
export function parseMessageEntities(text, messageEntities, noLinks = false) {
    messageEntities = messageEntities || []

    let elements = []
    const s = splitMessageEntities(messageEntities)

    const handlers = noLinks ? handlersText : Object.assign({}, handlersText, handlersLinks)
    let prevOffset = 0

    s.forEach(q => {
        const offset = q.offset
        const length = q.length
        const textCut = text.substr(offset, length)
        let callers = null
        q.entities.sort((l, q) => {
            return l.length - q.length
        }).forEach(l => {
            const localOffset = l.offset - offset
            const localLength = l.length
            const textCutSmall = text.substr(l.offset, l.length)

            const handler = handlers[l._]
            if (!handler) return

            if(callers === null) {

                callers = _ => {
                    return {
                        offset: localOffset,
                        length: localLength,
                        component: handler(l, getNewlines(textCutSmall, noLinks), textCutSmall)
                    }
                }
            } else {
                let cc = callers()
                let c = <span>{textCut.substr(localOffset, cc.offset - localOffset)}{cc.component}{textCut.substr(localOffset + cc.offset + cc.length, localLength - cc.length - cc.offset)}</span>
                callers = _ => {
                    return {
                        offset: localOffset,
                        length: localLength,
                        component: handler(l, c, textCutSmall)
                    }
                }
            }
            // const component = handler(l, getNewlines(textCut, noLinks), textCut)


            // elements.push(component)
        })

        if (offset + length > prevOffset) {
            if (noLinks) {
                elements.push(<span>{text.substr(prevOffset, offset - prevOffset)}</span>)
            } else {
                const splitted = text.substr(prevOffset, offset - prevOffset).split("\n")
                for (let i = 0; i < splitted.length; i++) {
                    elements.push(<span>{splitted[i]}</span>)
                    if (i !== splitted.length - 1) {
                        elements.push(<br/>)
                    }
                }
            }
        }

        if(callers) {
            elements.push(callers().component)
        }

        prevOffset = offset + length

    })
    if (prevOffset < text.length) {
        if (noLinks) {
            elements.push(<span>{text.substr(prevOffset, text.length - prevOffset)}</span>)
        } else {
            const splitted = text.substr(prevOffset, text.length - prevOffset).split("\n")
            for (let i = 0; i < splitted.length; i++) {
                elements.push(<span>{splitted[i]}</span>)
                if (i !== splitted.length - 1) {
                    elements.push(<br/>)
                }
            }
        }
    }

    return elements
}