// /**
//  * @property {Element|Node} $el
//  */
// export const FrameworkComponent = {
//     __: {
//         inited: false,
//         mounted: false,
//         destroyed: false,
//         created: false,
//         reactive: {}
//     },
//
//     name: "generic",
//     $el: undefined,
//     vParent: undefined,
//     state: {},
//
//     props: {},
//
//     h() {
//         throw new Error("implement pls")
//     },
//
//     created() {
//         console.warn("created", this)
//     },
//
//     mounted() {
//         console.warn("mounted", this)
//     },
//
//     destroy() {
//     },
//
//     patch(vNode) {
//         return vNode
//     },
//
//     delete() {
//         this.destroy()
//         this.$el.remove()
//     },
//
//     __render(props) {
//         this.__init()
//
//         this.props = props
//         const vNode = this.h(props)
//
//         vNode.component = this
//         vNode.attrs["data-component"] = this.name
//
//         return vNode
//     },
//
//     __patch(props) {
//         this.__init()
//
//         this.$el = VDOM.patchReal(this.$el, this.__render(props))
//     },
//
//     __init() {
//         if (!this.__.inited) {
//             for (const [key, value] of Object.entries(this)) {
//                 if (typeof value === "function") {
//                     this[key] = value.bind(this)
//                 }
//             }
//
//             for (const [k, v] of Object.entries(this.state)) {
//                 console.warn(k, v)
//                 if (v && v.__rc) {
//                     v.component = this
//                     v.key = k
//                     this.state[k] = undefined
//                 }
//             }
//
//             this.__.inited = true
//         }
//     }
// }