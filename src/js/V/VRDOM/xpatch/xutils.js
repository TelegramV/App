/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

export function isTextNode($node) {
    return $node.nodeType === Node.TEXT_NODE;
}

export function isVNode(vNode) {
    return vNode && typeof vNode === "object" && vNode.__is_v;
}

export function isComponentVNode(vNode) {
    return typeof vNode.tagName === "function";
}

export function isNullVNode(vNode) {
    return !vNode;
}

export function hasComponent($node) {
    return $node.__v.component;
}

export function hasSameConstructor($node, vNode) {
    return $node.__v.component.constructor === vNode.tagName;
}

export function shallowCompare(a, b) {
    for (const key in b) {
        if (b[key] !== a[key]) {
            return true;
        }
    }

    return false;
}

export function isDefinedAttribute(value) {
    return value || value === 0;
}

export function isUndefinedNode(value) {
    return !value && value !== 0 && value !== "";
}

export function propIn(name, object) {
    return name in object;
}

export function initElement($el: HTMLElement) {
    if (!$el.__v) {
        $el.__v = Object.create(null)
        $el.__v.patched_styles = new Set()
        $el.__v.patched_events = new Set()
    } else {
        if (!($el.__v.patched_styles instanceof Set)) {
            $el.__v.patched_styles = new Set()
        }

        if (!($el.__v.patched_events instanceof Set)) {
            $el.__v.patched_events = new Set()
        }
    }
}

export function zip(xs, ys) {
    const zipped = [];

    for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
        zipped.push([xs[i], ys[i]]);
    }

    return zipped;
}