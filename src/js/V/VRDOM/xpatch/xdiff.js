import __component_clearAppEvents from "../component/__component_clearAppEvents"
import __component_recreateAppEvents from "../component/__component_recreateAppEvents"
import createComponentInstance from "./xcreateComponentInstance"
import {
    hasComponent,
    hasSameConstructor,
    initElement,
    isComponentVNode,
    isNullVNode,
    isTextNode,
    isVNode,
    shallowCompare,
    zip
} from "./xutils"
import render from "./xrender"

function log_patch(...value) {
    // console.log(value[0]);
}

function replace($node, vNode, isComponent, options) {
    const $newNode = render(vNode, options);

    if (hasComponent($node) && !isComponent) {
        unmount($node);
    }

    if (vNode.ref) {
        vNode.ref.$el = $newNode;
    }

    $node.replaceWith($newNode);

    return $newNode;
}

function unmount($node) {
    const component = $node.__v.component;

    component.componentWillUnmount();

    component.clearIntervals();
    component.clearTimeouts();

    __component_clearAppEvents(component);

    component.props = null;
    component.slot = null;

    if (component.__.stateful && component.globalState) {
        if (component.globalState) {
            for (const state of Object.values(component.globalState)) {
                state.__components.delete(component);
            }
        }
    }
    component.state = null;

    component.$el.__v.component = null;
    component.$el = null;
    component.__.destroyed = true;
    component.__.mounted = false;
}

function diffAttrs($node: HTMLElement, vNode) {
    const patches = [];

    for (const [name, value] of Object.entries(vNode.attributes)) {
        if (name === "style") {
            continue;
        }

        if (value) {
            if ($node.getAttribute(name) != value) {
                patches.push($el => $el.setAttribute(name, value));
            }
        } else {
            patches.push($el => $el.removeAttribute(name));
        }
    }

    for (const name in $node.getAttributeNames()) {
        if (name === "style") {
            continue;
        }

        if (!vNode.attributes[name]) {
            patches.push($el => $el.removeAttribute(name));
        }
    }

    log_patch("diff attrs", $node, vNode)

    return $el => {
        log_patch("patch attrs", $el, vNode)

        for (const patch of patches) {
            patch($el);
        }

        return $el;
    };
}

function diffEvents($node: HTMLElement, vNode) {
    const patches = [];

    for (const [k, v] of Object.entries(vNode.events)) {
        patches.push(() => {
            $node[`on${k}`] = v;

            return $node;
        });
    }

    log_patch("diff events", $node, vNode)

    return () => {
        for (const patch of patches) {
            patch();
        }

        log_patch("patch events", $node, vNode)

        return $node;
    };
}

function diffStyle($node, vNode) {
    const patches = [];

    if (typeof $node.style === "object") {
        if (!$node.__v.patched_styles) {
            console.error("BUG: no __v.patched styles defined")
        }

        for (const [name, value] of Object.entries(vNode.style)) {
            if (!value && value !== 0) {
                $node.__v.patched_styles.delete(name);

                patches.push($el => {
                    $el.style.removeProperty(name);
                });
            } else if ($node.style.getPropertyValue(name) !== value) {
                $node.__v.patched_styles.add(name);

                patches.push($el => {
                    $el.style.setProperty(name, value);
                });
            }
        }

        for (const name of $node.__v.patched_styles) {
            if (!vNode.style[name] && vNode.style[name] !== 0) {
                $node.__v.patched_styles.delete(name);

                patches.push($el => {
                    $el.style.removeProperty(name);
                });
            }
        }
    } else {
        $node.__v.patched_styles.clear();

        patches.push($el => {
            $el.setAttribute("style", vNode.style)
        });
    }

    return $el => {
        for (const patch of patches) {
            patch($el);
        }
    }
}

const diffChildren = ($node: HTMLElement, vNode, options) => {
    const $children = $node.childNodes;
    const children = vNode.children;

    const patches = [];

    $children.forEach(($oldChild, i) => {
        patches.push(diff($oldChild, children[i], false, options));
    });

    const additionalPatches = [];

    // if (children.length > $children.length) {
    //     for (let i = $children.length; i < children.length; i++) {
    //         additionalPatches.push($el => {
    //             $el.appendChild(render(children[i], options));
    //             return $el;
    //         });
    //     }
    // } else if (children.length < $children.length) {
    //     Array.from($children.values()).slice(children.length).forEach(($node: Node) => {
    //         additionalPatches.push($el => {
    //             $el.remove();
    //             return $el;
    //         });
    //
    //         // if (options.touchAll || $node.__v || $node.nodeType === Node.TEXT_NODE) {
    //         //     vrdom_delete($node)
    //         // }
    //     })
    // }

    for (const additionalVChild of vNode.children.slice($node.childNodes.length)) {
        additionalPatches.push($el => {
            $el.appendChild(render(additionalVChild, options));

            return $el;
        });
    }

    log_patch("diff children", $node, vNode)

    return $el => {
        log_patch("patch children", $node, vNode)

        for (const [patch, $child] of zip(patches, $node.childNodes)) {
            patch($child);
        }

        for (const patch of additionalPatches) {
            patch($el);
        }

        return $node;
    };
};

function diff(
    $node: HTMLElement | Text | { __v: any },
    vNode: any,
    isComponent = false,
    options = {},
): Function {
    const callBack = options.componentCallbacks;

    if (!callBack) {
        options.componentCallbacks = [];
    }

    initElement($node);

    if (isNullVNode(vNode)) {
        if (hasComponent($node)) {
            unmount($node);
        }

        // console.error("isNullVNode", vNode, $node)

        return $el => {
            $el.remove();
        }
    }

    if (isComponentVNode(vNode)) {
        if (isTextNode($node)) {
            return $el => replace($el, vNode, isComponent, options);
        }

        let createNewComponent = () => {
            let component = createComponentInstance(vNode);

            if (component.componentWillMount) {
                component.componentWillMount(component.props);
            }

            return component;
        }

        const diffComponent = component => diff(
            $node,
            component.render(component.props, component.state, component.globalState),
            true,
            options,
        );

        const queueComponentDidMount = component => {
            if (component.componentDidMount) {
                options.componentCallbacks.push(() => {
                    component.__.mounted = true;
                    component.componentDidMount()
                });
            }
        }

        const queueComponentDidUpdate = component => {
            if (component.componentDidUpdate) {
                options.componentCallbacks.push(() => component.componentDidUpdate());
            }
        }

        if (hasComponent($node)) {
            if (hasSameConstructor($node, vNode)) {
                const oldComponent = $node.__v.component;

                if (!oldComponent.__.mounted) {
                    return $el => $el;
                }

                let shouldUpdate;

                shouldUpdate = oldComponent.shouldComponentUpdate(
                    {...oldComponent.props, ...vNode.attributes},
                    oldComponent.state,
                );

                if (shouldUpdate == null) {
                    shouldUpdate = shallowCompare(oldComponent.props, vNode.attributes);
                }

                if (!shouldUpdate) {
                    return $el => $el;
                }

                if (vNode.ref) {
                    vNode.ref.component = oldComponent;
                }

                if (oldComponent.componentWillUpdate) {
                    oldComponent.componentWillUpdate({...oldComponent.props, ...vNode.attributes}, oldComponent.state);
                }

                Object.assign(oldComponent.props, vNode.attributes);

                __component_recreateAppEvents(oldComponent);

                const patchComponent = diffComponent(oldComponent);

                queueComponentDidUpdate(oldComponent);

                return $el => {
                    const $patchedEl = patchComponent($el);

                    oldComponent.$el = $patchedEl;
                    $patchedEl.__v.component = oldComponent;

                    return $patchedEl;
                }
            } else {
                unmount($node);

                const component = createNewComponent();
                const patchComponent = diffComponent(component);

                queueComponentDidMount(component);

                return $el => {
                    const $patchedEl = patchComponent($el);

                    component.$el = $patchedEl;
                    $patchedEl.__v.component = component;

                    return $patchedEl;
                }
            }
        }

        const component = createNewComponent();
        const patchComponent = diffComponent(component);

        queueComponentDidMount(component);

        return $el => {
            const $patchedEl = patchComponent($el);

            component.$el = $patchedEl;
            $patchedEl.__v.component = component;

            return $patchedEl;
        }
    }

    if (isVNode(vNode)) {
        if (isTextNode($node)) {
            return $el => replace($el, vNode, isComponent, options);
        }

        if (hasComponent($node) && !isComponent) {
            unmount($node);

            const patch = diff($node, vNode, false, options);

            return $el => {
                return patch($el);
            }
        }
    }

    if (
        typeof vNode === "string" ||
        typeof vNode === "number" ||
        !vNode ||
        !vNode.__is_v
    ) {
        const value = String(vNode);

        if (value !== $node.nodeValue) {
            if (hasComponent($node)) {
                unmount($node);
            }

            return $el => {
                return replace($el, value, isComponent, options);
            }
        }

        if (hasComponent($node)) {
            unmount($node);
        }

        return $el => {
            return $el;
        }
    }

    if ($node.tagName.toLowerCase() !== vNode.tagName.toLowerCase()) {
        return $el => replace($el, vNode, isComponent, options);
    }

    const patchAttrs = diffAttrs($node, vNode);
    const patchEvents = diffEvents($node, vNode);
    const patchStyle = diffStyle($node, vNode);

    const patchChildren = diffChildren($node, vNode, options);

    return $el => {
        if (vNode.ref) {
            vNode.ref.$el = $el;
        }

        patchAttrs($el);
        patchEvents($el);
        patchStyle($el);

        patchChildren($el);

        if (!callBack) {
            options.componentCallbacks.forEach(fn => fn());
        }

        return $el;
    };
}

export default diff;