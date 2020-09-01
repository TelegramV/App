import attributeToString from "../../../Utils/attributeToString"
import {text2emoji} from "../../../Ui/Plugins/EmojiTextInterceptor"
import {isUndefinedNode, isVNode} from "./xutils"

function isFragment(vNode) {
    return vNode.tagName === 69;
}

const attrAliases = new Map([
    ["className", "class"],
    ["class", "class"],
    ["htmlFor", "for"],
    ["xlinkHref", "xlink:href"],
    ["onDoubleClick", "ondblclick"],
])

function createElement(tagName, attributes, ...children) {
    const isComponent = typeof tagName === "function";

    const flatten = [];

    for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (isUndefinedNode(child)) {
            continue;
        }

        if (Array.isArray(child)) {
            for (let j = 0; j < child.length; j++) {
                if (!isUndefinedNode(child[j])) {
                    flatten.push(child[j])
                }
            }
        } else if (isFragment(child)) {
            for (let j = 0; j < child.children.length; j++) {
                if (!isUndefinedNode(child.children[j])) {
                    flatten.push(child.children[j])
                }
            }
        } else if (typeof child === "string") {
            const textchildren = text2emoji(child);

            for (let j = 0; j < textchildren.length; j++) {
                flatten.push(textchildren[j]);
            }
        } else {
            flatten.push(child);
        }
    }

    children = flatten;

    const attrs = {};
    const events = {};
    const style = {};
    const props = {};

    let ref = undefined;

    if (attributes) {
        if (isComponent) {
            for (let [name, value] of Object.entries(attributes)) {
                if (name === "ref") {
                    ref = value;
                } else {
                    attrs[name] = value;
                }
            }
        } else {
            for (let [name, value] of Object.entries(attributes)) {
                if (name.startsWith("on")) {
                    events[name.substring(2).toLowerCase()] = value;
                } else if (name === "ref") {
                    ref = value;
                } else if (name === "style" && typeof value === "object") {
                    Object.assign(style, value);
                } else if (attrAliases.has(name)) {
                    attrs[attrAliases.get(name)] = attributeToString(value);
                } else if (name.startsWith("css-")) {
                    const styleKey = name.substring(4);
                    style[styleKey] = value;
                } else {
                    attrs[name] = value;
                }
            }
        }
    }

    if (isComponent) {
        attributes = attributes || {};

        if (tagName.defaultProps) {
            for (const name in tagName.defaultProps) {
                if (!(name in attributes)) {
                    attributes[name] = tagName.defaultProps[name];
                }
            }
        }

        if (tagName.prototype && !tagName.prototype.render) {
            const vNode = tagName(attributes, children);

            if (isVNode(vNode) && !vNode.ref) {
                vNode.ref = attributes.ref;
            }

            return vNode;
        }
    }

    return createVNode(
        tagName,
        attrs,
        props,
        events,
        style,
        children,
        ref
    );
}

function createVNode(
    tagName,
    attributes,
    props,
    events,
    style,
    children,
    ref
) {
    const vNode = {
        __is_v: true,

        tagName,
        attributes,
        props,
        events,
        style,
        children,

        ref,
    };

    return vNode;
}

export default createElement;