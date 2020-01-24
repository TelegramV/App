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
     * @param {Component} component
     * @return boolean false to prevent mounting
     */
    componentMounting(component) {

    }

    /**
     * Currently is not implement.
     *
     * @param {Element} $el
     * @return boolean false to prevent mounting
     */
    elementMounting($el) {

    }

    /**
     * Be careful with this: `$el` can be component's created $element.
     *
     * @param {Element|Node} $el
     */
    elementCreated($el) {

    }

    /**
     * Be careful with this: `$el` can be component's mounted $element.
     *
     * @param {Element|Node} $el
     */
    elementMounted($el) {

    }
}