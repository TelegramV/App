/**
 * (c) Telegram V
 */

import VF from "../../VFramework"

const renderText = text => {
    const $node = document.createTextNode(text)
    VF.plugins.forEach(plugin => plugin.textCreated($node))
    return $node
}

export default renderText