import type {ComponentMeta, ComponentProps, VRAttrs, VRSlot} from "./types/types"
import V from "../VFramework"
import vrdom_delete from "./delete"

/**
 * PLEASE, use this instead of {@link Component}
 */
export class VComponent {

    __: ComponentMeta = {
        inited: false,
        mounted: false,
        destroyed: false,
        created: false,
        isPatchingItself: false,
        isDeletingItself: false,

        reactiveObjectContexts: new Map(),
        reactiveCallbackContexts: new Map(),

        appEventContexts: new Map(),

        reactiveInited: false
    }

    name: string
    identifier: string
    $el: HTMLElement
    props: VRAttrs = {}
    slot: VRSlot = undefined
    refs: Map<string, VComponent>

    constructor(props: ComponentProps) {
        this.name = props.name || this.constructor.name
        this.props = props.props || {}
        this.slot = props.slot
        this.refs = V.mountedComponents
    }

    h() {
    }

    init() {
    }

    mounted() {
    }

    created() {
    }

    destroy() {

    }

    appEvents() {
        //
    }

    reactiveObjects() {
        //
    }

    __init() {
        if (!this.__.inited) {

            this.init()

            this.__.inited = true
        }
    }

    __render() {
        this.__init()

        return this.h()
    }

    __mount($el: HTMLElement) {
        this.$el = $el
        this.mounted()
        this.__.mounted = true
    }

    __created() {
        this.created()
        this.__.created = true
    }

    __delete() {
        this.__.isDeletingItself = true
        this.destroy()
        vrdom_delete(this.$el)
        V.mountedComponents.delete(this.identifier)
    }
}