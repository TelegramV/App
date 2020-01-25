import {VRDOMPlugin} from "../v/vrdom/plugin"

class RippleVRDOMPlugin extends VRDOMPlugin {
    elementCreated($el) {
        if ($el.nodeType !== Node.TEXT_NODE && $el.classList.contains("rp")) {
            $el.addEventListener("mousedown", function (e) {
                let rect = this.getBoundingClientRect()

                let X = e.clientX - rect.left
                let Y = e.clientY - rect.top

                let $rippleDiv = document.createElement("div")

                $rippleDiv.classList.add("ripple")

                $rippleDiv.style.top = `${Y}px`
                $rippleDiv.style.left = `${X}px`

                this.appendChild($rippleDiv)

                setTimeout(function () {
                    $rippleDiv.remove()
                }, 900)
            })
        }
    }
}

const RipplePlugin = new RippleVRDOMPlugin()

export default RipplePlugin