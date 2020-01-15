import vdom_isNamedComponent from "./check/isNamedComponent"
import vdom_isSimpleComponent from "./check/isSimpleComponent"
import vdom_isVNode from "./check/isVNode"
import vdom_createEmptyNode from "./createEmptyNode"
import VDOM from "./index"

function removeIfs(array) {
    for (let i = 0; i < array.length; i++) {
        if (vdom_isVNode(array[i]) && !array[i].renderIf) {
            array.splice(i, 1)
        }
    }
}

/**
 * Creates Virtual Node
 *
 * WARNING: Virtual Node != Component. Thus, methods with same name can do different job!
 *
 * Components:
 *
 * A component is simply a function that passes attributes as parameters and returns virtual node.
 *
 * - simple component:
 *   {@code
 *      const Component = ({someProperty}) => {
 *          return <h1>{someProperty}</h1>
 *      }
 *
 *      const vNode = (
 *          <div className="someClass">
 *              <Component someProperty={`Today is ${new Date()}`}/>
 *          </div>
 *      )
 *   }
 *
 * - component with slot:
 *   {@code
 *      const ComponentWithSlot = ({someProperty, slot}) => {
 *          return (
 *              <div>
 *                  <h1>{someProperty}</h1>
 *                  {slot}
 *              </div>
 *          )
 *      }
 *
 *      const vNode = (
 *          <div className="someClass">
 *              <ComponentWithSlot someProperty={`Today is ${new Date()}`}>
 *                  <p>
 *                      lorem ipsum dolor sit amet..
 *                  </p>
 *              </ComponentWithSlot>
 *          </div>
 *      )
 *   }
 *
 * - named component:
 *   {@code
 *      const NamedComponent = {
 *          name: "named-component",
 *          h({someProperty}) {
 *              return <h1>{someProperty}</h1>
 *          }
 *      }
 *
 *      // ...
 *   }
 *
 * @param tagName
 * @param vNode
 * @returns {*}
 */
function vdom_h(tagName, vNode) {
    // removeIfs(vNode.children) // todo: uncomment this there is a need. but without this rendering is faster

    // for fragments
    // if (tagName === VDOM.Fragment) {
    //     console.log(tagName, vNode)
    //     if (!vNode.parent) {
    //         throw new Error("fragment without parent cannot be rendered")
    //     } else {
    //         vNode.parent.children = []
    //         vNode.parent.children.push(...vNode.children)
    //     }
    // }

    // component
    if (vdom_isSimpleComponent(tagName)) {
        return tagName(Object.assign(vNode.attrs, {slot: vNode.children}))
    }

    // named component
    if (vdom_isNamedComponent(tagName)) {
        const component = tagName

        if (!component.__ || !component.__.inited) {
            // component meta info. do not ever change this manually!
            component.__ = component.__ || {
                inited: false,
                mounted: false,
                destroyed: false,
                created: false,
                reactive: {}
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

            // returns a virtual node
            component.h = (component.h || function () {
                throw new Error("implement pls")
            }).bind(component)

            // event.
            // called when the component was rendered by vdom_render
            // called always before `mounted`
            component.created = (component.created || function () {
            }).bind(component)

            // event.
            // called when some reactive property from the state was changed
            component.changed = (component.changed || function (key, value) {
            }).bind(component)

            // event.
            // called when component has mounted to real DOM
            component.mounted = (component.mounted || function () {
            }).bind(component)

            // event.
            // called when component is destroying.
            // fixme: not implemented yet
            component.destroy = (component.destroy || function () {
            }).bind(component)

            // event.
            // called when trying patch the component by `__patch`
            // passes vNode: a new virtualNode to be patched
            // returns vNode or false
            // if returns false then will not be patched
            component.patch = (component.patch || function (vNode) {
                return vNode
            }).bind(component)

            // remove component from DOM
            component.delete = (component.delete || function () {
                this.destroy()
                this.$el.remove()
            }).bind(component)

            // ...
            component.__render = (component.__render || function (props) {
                this.__init()

                if (props) {
                    Object.assign(this.props, props)
                }

                const vNode = this.h(props)

                vNode.component = this
                vNode.attrs["data-component"] = this.name

                return vNode
            }).bind(component)

            // ...
            component.__patch = (component.__patch || function (props) {
                this.__init()

                if (this.patch(this.__render(props))) {
                    this.$el = VDOM.patchReal(this.$el, this.__render(props))
                }
            }).bind(component)

            // ...
            component.__init = (component.__init || function () {
                if (!this.__.inited) {
                    for (const [key, value] of Object.entries(this)) {
                        if (typeof value === "function") {
                            this[key] = value.bind(this)
                        }
                    }

                    for (const [k, v] of Object.entries(this.reactive)) {
                        if (v && v.__rc) {
                            v.component = this
                            v.key = k
                            this.reactive[k] = v.defaultValue
                        } else {
                            console.error(`not reactive value ${k}`, value)
                        }
                    }

                    this.__.inited = true
                }
            }).bind(component)
        }

        // debugger

        component.__init()

        const vComponentElem = component.__render(Object.assign(vNode.attrs, {slot: vNode.children}))

        vComponentElem.renderIf = vNode.renderIf

        return vComponentElem
    }

    const vElem = vdom_createEmptyNode()
    Object.assign(vElem, vNode)
    vElem.tagName = tagName

    // for fragments
    // vElem.children.forEach(vChild => {
    //     console.log("setting parent", vElem, vChild)
    //     if (vdom_isVNode(vChild)) {
    //         vChild.parent = vElem
    //     }
    // })

    return vElem
}

export default vdom_h
