/**
 * (c) Telegram V
 */

import _attr_arrayOrObjectJoin from "./_attr_arrayOrObjectJoin"

const classAttrProcessor = value => {
    return _attr_arrayOrObjectJoin(value)
}

export default classAttrProcessor