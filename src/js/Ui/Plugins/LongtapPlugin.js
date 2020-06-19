import VRDOMPlugin from "../../V/VRDOM/plugin/VRDOMPlugin"

class LongtapVRDOMPlugin extends VRDOMPlugin {
    elementDidMount($el) {
        if ($el.nodeType !== Node.TEXT_NODE && $el.oncontextmenu) {
            let timeout = 0;

            ["mousedown", "touchstart"].forEach(ev => {
                $el.addEventListener(ev, function(e) {
                    clearTimeout(timeout);
                    $el.classList.add("no-select");
                    timeout = setTimeout(_ => {
                        let rect = $el.getBoundingClientRect();
                        let event = new MouseEvent('contextmenu', {
                            clientX: rect.left + rect.width / 2,
                            clientY: rect.top + rect.height / 2,
                        });
                        $el.dispatchEvent(event);
                        $el.classList.remove("no-select");
                    }, 1000)
                }, { passive: true })
            });

            ["mousemove", "touchmove"].forEach(ev => {
                $el.addEventListener(ev, function(e) {
                    clearTimeout(timeout);
                    $el.classList.remove("no-select");
                }, { passive: true });
            });

            ["mouseup", "touchend"].forEach(ev => {
                $el.addEventListener(ev, function(e) {
                    clearTimeout(timeout);
                    $el.classList.remove("no-select");
                }, { passive: true });
            });
        }
    }
}

export default LongtapVRDOMPlugin