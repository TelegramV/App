import VRDOMPlugin from "../../V/VRDOM/plugin/VRDOMPlugin"
import { IS_MOBILE_SCREEN } from "../../Utils/browser"

const LONG_TAP_DURATION_MS = 500;

class LongtapVRDOMPlugin extends VRDOMPlugin {
    elementDidMount($el) {
        if (!IS_MOBILE_SCREEN) return;

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

                document.getElementById("app").classList.add("no-select");

                let rect = $el.getBoundingClientRect();
                const loc = e.touches ? e.touches[0] : e;

                let timeout = setTimeout(_ => {
                    // cancel next click, to fix Android
                    $el.addEventListener('touchend', function cancelClick(e) {
                        element.removeEventListener('touchend', cancelClick, true);
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        e.stopPropagation();
                    }, true);

                    const pageTop = window.visualViewport.pageTop // fix for open keyboard on IOS

                    let event = new MouseEvent('contextmenu', {
                        clientX: loc.clientX || rect.left + rect.width / 2,
                        clientY: (loc.clientY || rect.top + rect.height / 2) + pageTop/2,
                    });
                    $el.dispatchEvent(event);

                    document.getElementById("app").classList.remove("no-select");
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
        console.log("cancel")
        const timeout = $el.getAttribute("longtap-timeout");
        if (timeout) {
            clearTimeout(Number.parseInt(timeout));
        }
        document.getElementById("app").classList.remove("no-select");
    }
}

export default LongtapVRDOMPlugin