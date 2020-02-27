/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
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