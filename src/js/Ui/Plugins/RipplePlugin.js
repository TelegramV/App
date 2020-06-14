import VRDOMPlugin from "../../V/VRDOM/plugin/VRDOMPlugin"

class RippleVRDOMPlugin extends VRDOMPlugin {
    elementDidMount($el) {
        if ($el.nodeType !== Node.TEXT_NODE && $el.classList.contains("rp")) {
            $el.addEventListener("mousedown", function (e) {
                let rect = this.getBoundingClientRect()

                let X = e.clientX - rect.left
                let Y = e.clientY - rect.top

                const $rippleDiv = document.createElement("div")
                $rippleDiv.__ripple = true

                $rippleDiv.classList.add("ripple")
                //
                $rippleDiv.style.top = `${Y}px`
                $rippleDiv.style.left = `${X}px`

                this.appendChild($rippleDiv)

                setTimeout(function () {
                    $rippleDiv.remove()
                }, 900)
            }, {
                passive: true
            })
        }
    }
}

export default RippleVRDOMPlugin