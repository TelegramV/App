/**
 * (c) Telegram V
 */

const patchText = ($node: Text, text: string) => {
    const vString = String(text)

    if ($node.textContent.length !== vString.length || $node.textContent !== vString) {
        $node.nodeValue = vString
    }

    return $node
}

export default patchText