import VRDOMPlugin from "../../V/VRDOM/plugin/VRDOMPlugin"
import { IS_MOBILE_SCREEN } from "../../Utils/browser"

const LONG_TAP_DURATION_MS = 250;

class LongtapVRDOMPlugin extends VRDOMPlugin {
    elementDidMount($el) {
        if (!IS_MOBILE_SCREEN) return;

        if ($el.nodeType !== Node.TEXT_NODE && $el.oncontextmenu) {
            ["mousedown", "touchstart"].forEach(this.handleStart($el));
            ["mousemove", "touchmove"].forEach(this.handleMove($el));
            ["mouseup", "touchend"].forEach(this.handleEnd($el));
        }
    }

    handleStart = $el => {
        return (ev) => {
            const cancel = this.cancel;
            $el.addEventListener(ev, e => {
                if (e.which !== 1) return;

                cancel($el);
                console.log("added")
                document.getElementById("app").classList.add("no-select");

                let rect = $el.getBoundingClientRect();

                let timeout = setTimeout(_ => {
                    let event = new MouseEvent('contextmenu', {
                        clientX: e.clientX || rect.left + rect.width / 2,
                        clientY: e.clientY || rect.top + rect.height / 2,
                    });
                    $el.dispatchEvent(event);
                    $el.classList.remove("no-select");
                }, 500)
                $el.setAttribute("longtap-timeout", timeout);

            }, { passive: true })
        }
    }

    handleMove = $el => {
        const cancel = this.cancel;
        return (ev) => {
            $el.addEventListener(ev, e => {
                cancel($el);
            }, { passive: true });
        }
    }

    handleEnd = $el => {
        const cancel = this.cancel;
        return (ev) => {
            $el.addEventListener(ev, e => {
                cancel($el);
            }, { passive: true });
        }
    }

    cancel = ($el) => {
        const timeout = $el.getAttribute("longtap-timeout");
        if(timeout) {
            clearTimeout(Number.parseInt(timeout));
        }
        document.getElementById("app").classList.remove("no-select");
    }
}

export default LongtapVRDOMPlugin