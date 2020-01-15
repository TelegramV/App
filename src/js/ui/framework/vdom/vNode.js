import vdom_isNamedComponent from "./check/isNamedComponent"

/**
 // * @property {FrameworkComponent|undefined} component
 */
export const VNode = {
    __virtual: true,
    tagName: "div",
    component: undefined,
    attrs: {},
    events: new Map(),
    children: [],
    dangerouslySetInnerHTML: false,
    renderIf: true,

    get isComponent() {
        return this.component !== undefined && vdom_isNamedComponent(this.component)
    }
}
