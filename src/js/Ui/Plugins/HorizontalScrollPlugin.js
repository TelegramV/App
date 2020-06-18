import VRDOMPlugin from "../../V/VRDOM/plugin/VRDOMPlugin"

class HorizontalScrollVRDOMPlugin extends VRDOMPlugin {
    elementDidMount($el) {
        if ($el.nodeType !== Node.TEXT_NODE && $el.classList.contains("scrollable-x")) {
            $el.addEventListener('wheel', this.transformScroll/*, {passive: true}*/) //you can't prevent default in passive listener
        }
    }

    transformScroll = (event) => {
        if (!event.deltaY) {
            return
        }

        event.currentTarget.scrollTo({
            top: 0,
            left: event.deltaY + event.deltaX + event.currentTarget.scrollLeft,
            behavior: 'smooth'
        })
        // event.currentTarget.scrollLeft += event.deltaY + event.deltaX;
        event.preventDefault()
    }
}

export default HorizontalScrollVRDOMPlugin
