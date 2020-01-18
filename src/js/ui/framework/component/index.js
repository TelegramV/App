export const createComponent = (component) => {
    throw new Error("deprecated")
    if (!component.__ || !component.__.inited) {
        // component meta info. do not ever change this manually!
        component.__ = {
            inited: false,
            mounted: false,
            destroyed: false,
            created: false,
            reactive: {},
            patchingSelf: false
        }

        // mounted real DOM $node
        component.$el = component.$el || undefined

        // mb deprecated because not implemented yet
        component.vParent = component.vParent || undefined

        // the component state.
        component.state = component.state || {}

        // the reactive component state.
        component.reactive = component.reactive || {}

        // mb deprecated
        component.props = component.props || {}

        // mb deprecated
        component.methods = component.methods || {}

        // mb deprecated
        component.slot = component.slot || undefined

        // returns a virtual node
        component.h = (component.h || function () {
            throw new Error("implement pls")
        })

        // event.
        // called when the component was rendered by vdom_render
        // called always before `mounted`
        component.created = (component.created || function () {
            console.log("component created", this)
        })

        // event.
        // called when some reactive property from the state was changed
        component.changed = (component.changed || function (key, value) {
        })

        // event.
        // called when component has mounted to real DOM
        component.mounted = (component.mounted || function () {
            console.log("component mounted", this)
        })

        // event.
        // called when component is destroying.
        // fixme: not implemented yet
        component.destroy = (component.destroy || function () {
            console.log("component destroy request", this)
        })

        // event.
        // called when trying patch the component by `__patch`
        // passes vNode: a new virtualNode to be patched
        // returns vNode or false
        // if returns false then will not be patched
        component.patch = (component.patch || function (vNode) {
            return vNode
        })

    }

    return component
}