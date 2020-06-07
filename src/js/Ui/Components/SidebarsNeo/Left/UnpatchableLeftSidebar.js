import {LeftSidebar} from "./LeftSidebar";

// Unfortunately, due to limitations of patching in V, there's currently no way to correctly implement
// dialog list without lags with virtualization. Due to this, I, @undrfined, created this monster.
// Basically just a sidebar that should never ever ever (!) be patched, with dialogs added via real DOM.
// That's it. Deal with it!
// TODO get rid of this bs..
export class UnpatchableLeftSidebar extends LeftSidebar {
    hide() {
        this.$el.classList.toggle("hidden", true)
    }

    fadeOut() {
        this.$el.classList.toggle("fade-out", true)
    }

    show() {
        this.$el.classList.toggle("really-hidden", false)

        this.$el.classList.toggle("unhidden", this.$el.classList.contains("hidden"))
        this.$el.classList.toggle("hidden", false)
        this.$el.classList.toggle("fade-in", this.$el.classList.contains("fade-out"))
        this.$el.classList.toggle("fade-out", false)
    }

    set reallyHidden(value) {
        this.$el.classList.toggle("really-hidden", value)
    }

    onTransitionEnd = (ev) => {
        if(ev.animationName === "fade-in") {
            this.$el.classList.toggle("fade-out", false)

            return
        }

        if(ev.animationName === "unhidden") {
            this.$el.classList.toggle("unhidden", false)

            return
        }
        if((this.$el.classList.contains("hidden") || this.$el.classList.contains("fade-out")) && !this.$el.classList.contains("really-hidden")) {
            this.reallyHidden = true
        }
    }
}