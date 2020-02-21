/**
 * (c) Telegram V
 */
import vrdom_delete from "../delete"

const patchVRNodeUndefined = ($node: Element) => {

    vrdom_delete($node)

    return undefined
}

export default patchVRNodeUndefined