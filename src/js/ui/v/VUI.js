export class VUI {
    static showElement($el) {
        if ($el) {
            $el.classList.remove("hidden")
        }
    }

    static hideElement($el) {
        if ($el) {
            $el.classList.add("hidden")
        }
    }
}