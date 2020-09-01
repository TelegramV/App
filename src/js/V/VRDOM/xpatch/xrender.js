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

import createComponentInstance from "./xcreateComponentInstance"
import {initElement, isComponentVNode, isDefinedAttribute} from "./xutils"

function render(vNode, options = {}) {
    try {
        if (
            typeof vNode === "string" ||
            typeof vNode === "number" ||
            !vNode ||
            !vNode.__is_v
        ) {
            return document.createTextNode(String(vNode || ""));
        }

        if (isComponentVNode(vNode)) {
            const component = createComponentInstance(vNode);
            component.__.mounted = true;

            if (component.componentWillMount) {
                component.componentWillMount(vNode.attributes);
            }

            const dom = component.render(vNode.attributes, component.state, component.globalState);
            component.$el = render(dom, options);
            component.$el.__v.component = component;

            component.__.dom = dom;

            if (component.componentDidMount) {
                options.componentCallbacks.push(() => component.componentDidMount());
            }

            return component.$el;
        }

        const $el = document.createElement(vNode.tagName);

        initElement($el);

        for (const [k, v] of Object.entries(vNode.props)) {
            $el[k] = v;
        }

        for (const [k, v] of Object.entries(vNode.attributes)) {
            if (isDefinedAttribute(v)) {
                $el.setAttribute(k, v);
            }
        }

        for (const [k, v] of Object.entries(vNode.events)) {
            $el[`on${k}`] = v;
        }

        for (let [k, v] of Object.entries(vNode.style)) {
            if (v) {
                $el.style.setProperty(k, v);
                $el.__v.patched_styles.add(k);
            }
        }

        if (vNode.ref) {
            vNode.ref.$el = $el;
        }

        if ($el.classList.contains("rp")) {
            $el.addEventListener("mousedown", function (event) {
                let rect = this.getBoundingClientRect();

                let X = event.clientX - rect.left;
                let Y = event.clientY - rect.top;

                const $rippleDiv = document.createElement("div");
                $rippleDiv.__ripple = true;

                $rippleDiv.classList.add("ripple");

                $rippleDiv.style.top = `${Y}px`;
                $rippleDiv.style.left = `${X}px`;

                this.appendChild($rippleDiv);

                setTimeout(() => {
                    $rippleDiv.remove();
                }, 900);
            })
        }

        for (const child of vNode.children) {
            $el.appendChild(render(child, options));
        }

        return $el;
    } catch (e) {
        console.error(e)
        return document.createTextNode(e)
    }
}

export default render;