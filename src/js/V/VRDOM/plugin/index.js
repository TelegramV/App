/**
 * (c) Telegram V
 */

import VComponent from "../component/VComponent"

class VRDOMPlugin {
    constructor() {
    }

    /**
     * @param {VComponent} component
     */
    componentCreated(component: VComponent) {

    }

    /**
     * @param {VComponent} component
     */
    componentMounted(component: VComponent) {

    }

    /**
     * Currently is not implemented.
     *
     * @return {boolean} false to prevent mounting
     */
    componentMounting(component: VComponent) {
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

    elementPatched($el: Element) {

    }
}

export default VRDOMPlugin