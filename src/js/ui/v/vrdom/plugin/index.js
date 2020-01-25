import Component from "../component"

export class VRDOMPlugin {
    constructor() {
    }

    /**
     * @param {Component} component
     */
    componentCreated(component) {

    }

    /**
     * @param {Component} component
     */
    componentMounted(component) {

    }

    /**
     * Currently is not implement.
     *
     * @return {boolean} false to prevent mounting
     */
    componentMounting(component) {
        return true
    }

    /**
     * Currently is not implement.
     *
     * @return {boolean} false to prevent mounting
     */
    elementMounting($el) {
        return true
    }

    /**
     * Be careful with this: `$el` can be component's created $element.
     */
    elementCreated($el) {

    }

    /**
     * Be careful with this: `$el` can be component's mounted $element.
     */
    elementMounted($el) {

    }
}