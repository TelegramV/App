/**
 * @param {function} component
 * @param props
 * @param slot
 * @property {Component} component
 * @constructor
 */
export function ComponentVRNode(component, props = {}, slot = undefined) {
    this.component = component || false
    this.props = props || {}
    this.slot = slot
    this.ref = props.ref || undefined
}