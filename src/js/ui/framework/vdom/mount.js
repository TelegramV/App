export function vdom_mount($node, $target) {
    $target.replaceWith($node);
    return $node;
}

export default vdom_mount
