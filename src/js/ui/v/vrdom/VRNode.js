/**
 * @constructor
 */
export function VRNode(tagName, props) {
    this.__virtual = true

    this.tagName = tagName

    this.attrs = props.attrs || {}
    this.events = props.events

    this.dangerouslySetInnerHTML = props.dangerouslySetInnerHTML

    this.children = props.children || []

    this.component = props.component || false
}