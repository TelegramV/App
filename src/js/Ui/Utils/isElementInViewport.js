export function isElementInViewport($viewport: HTMLElement, $el: HTMLElement) {
    if (!$el) {
        return false
    }

    let rect = $el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= ($viewport.clientHeight) &&
        rect.right <= ($viewport.clientWidth)
    );
}