import {VRDOMPlugin} from "../framework/vrdom/plugin"

class RippleVRDOMPlugin extends VRDOMPlugin {
    elementMounted($el) {
        if ($el.nodeType !== Node.TEXT_NODE && $el.classList.contains("rp")) {
            $el.addEventListener("mousedown", function (e) {
                let rect = this.getBoundingClientRect()

                let X = e.clientX - rect.left;
                let Y = e.clientY - rect.top;

                let $rippleDiv = document.createElement("div")

                $rippleDiv.classList.add("ripple")
                $rippleDiv.setAttribute("style", "top:" + Y + "px; left:" + X + "px;")

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