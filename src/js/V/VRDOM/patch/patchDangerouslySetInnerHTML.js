/**
 * (c) Telegram V
 */

const patchDangerouslySetInnerHTML = ($node: Element, dangerouslySetInnerHTML: boolean | any) => {
    // we should actually check diff here, but fuck it, do not use this thing
    $node.innerHTML = dangerouslySetInnerHTML
    return $node
}

export default patchDangerouslySetInnerHTML