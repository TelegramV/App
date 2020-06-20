import VRDOMPlugin from "../../V/VRDOM/plugin/VRDOMPlugin"

class LongtapVRDOMPlugin extends VRDOMPlugin {
    elementDidMount($el) {
        if ($el.nodeType !== Node.TEXT_NODE && $el.oncontextmenu) {
            let timeout = 0;

            ["mousedown", "touchstart"].forEach(ev => {
                $el.addEventListener(ev, function(e) {
                    console.log(e);
                	if(!(e.isTrusted || e.which === 1)) return; //only left click
                    clearTimeout(timeout);
                    $el.classList.add("no-select");

                    let rect = $el.getBoundingClientRect();

                    timeout = setTimeout(_ => {
                        let event = new MouseEvent('contextmenu', {
                            clientX: e.clientX || rect.left + rect.width / 2,
                            clientY: e.clientY || rect.top + rect.height / 2,
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