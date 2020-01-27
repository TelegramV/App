import Component from "../component"

export class VRDOMPlugin {
    constructor() {
    }

    /**
     * @param {Component} component
     */
    componentCreated(component: Component) {

    }

    /**
     * @param {Component} component
     */
    componentMounted(component: Component) {

    }

    /**
     * Currently is not implemented.
     *
     * @return {boolean} false to prevent mounting
     */
    componentMounting(component: Component) {
        return true
    }

    /**
     * Currently is not implemented.
     *
     * @return {boolean} false to prevent mounting
     */
    elementMounting($el: Element) {
        return true
    }

    /**
     * Be careful with this: `$el` can be component's created $element.
     */
    elementCreated($el: Element) {

    }

    /**
     * Be careful with this: `$el` can be component's mounted $element.
     */
    elementMounted($el: Element) {

    }

    textCreated($text: Text) {

    }

    textMounted($text: Text) {

    }
}