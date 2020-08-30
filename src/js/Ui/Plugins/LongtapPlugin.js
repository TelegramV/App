import VRDOMPlugin from "../../V/VRDOM/plugin/VRDOMPlugin"
import { IS_MOBILE_SCREEN, IS_SAFARI } from "../../Utils/browser"

const LONG_TAP_DURATION_MS = 500;

class LongtapVRDOMPlugin extends VRDOMPlugin {
    elementDidMount($el) {
        if (!(IS_MOBILE_SCREEN && IS_SAFARI)) return;

        if ($el.nodeType !== Node.TEXT_NODE && $el.oncontextmenu && !$el.isContentEditable) { // we don't support contenteditable elements
            ["mousedown", "touchstart"].forEach(this.handleStart($el));
            ["mousemove", "mouseup", "touchmove", "touchcancel", "touchend"].forEach(this.cancelTimer($el));
        }
    }

    handleStart = $el => {
        return (ev) => {
            const cancel = this.cancel;
            $el.addEventListener(ev, e => {
                cancel($el);

                document.body.classList.add("no-select");

                let rect = $el.getBoundingClientRect();
                const loc = e.touches ? e.touches[0] : e;

                let timeout = setTimeout(_ => {
                    const pageTop = window.visualViewport.pageTop // fix for open keyboard on IOS

                    let event = new MouseEvent('contextmenu', {
                        clientX: loc.clientX || rect.left + rect.width / 2,
                        clientY: (loc.clientY || rect.top + rect.height / 2) + pageTop/2,
                    });
                    $el.dispatchEvent(event);

                    document.body.classList.remove("no-select");
                }, LONG_TAP_DURATION_MS)
                $el.setAttribute("longtap-timeout", timeout);
                return true;
            }, { passive: true })
        }
    }

    cancelTimer = $el => {
        return (ev) => {
            $el.addEventListener(ev, e => {
                this.cancel($el);
            }, { passive: true });
        }
    }

    cancel = ($el) => {
        const timeout = $el.getAttribute("longtap-timeout");
        if (timeout) {
            clearTimeout(Number.parseInt(timeout));
        }
        document.body.classList.remove("no-select");
    }
}

export default LongtapVRDOMPlugin