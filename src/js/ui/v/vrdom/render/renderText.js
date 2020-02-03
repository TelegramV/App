import V from "../../VFramework"

const renderText = text => {
    const $node = document.createTextNode(text)
    V.plugins.forEach(plugin => plugin.textCreated($node))
    return $node
}

export default renderText