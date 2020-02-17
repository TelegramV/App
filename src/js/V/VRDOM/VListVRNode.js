/**
 * (c) Telegram V
 */

import {List} from "./List"

export class VListVRNode {
    constructor(list: List, attrs) {
        this.list = list
        this.items = attrs.list
        this.template = attrs.template
    }
}