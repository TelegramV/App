/**
 * (c) Telegram V
 */

const patchClass = ($el: HTMLElement, className: any) => {
    if (!className) {
        $el.attributes.removeNamedItem("class")
        return
    }

    if (typeof className === "object") {
        for (let [classK, classV] of Object.entries(className)) {
            $el.classList.toggle(classK, classV)
        }
        className = Object.keys(className)
    } else if (Array.isArray(className)) {
        $el.classList.add(...className)
    } else {
        $el.classList.add(className)
        className = className.split(" ")
    }

    for (const oldClassName of $el.classList.values()) {
        if (!className[oldClassName]) {
            $el.classList.remove(oldClassName)
        }
    }
}

export default patchClass