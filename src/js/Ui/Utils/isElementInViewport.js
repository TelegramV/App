export function isElementInViewport($viewport: HTMLElement, $el: HTMLElement) {
    return $el.offsetTop + $el.offsetHeight >= $viewport.scrollTop &&
        $el.offsetTop <= $viewport.scrollTop + $viewport.offsetHeight;
    // if (!$el) {
    //     return false
    // }
    //
    // let rect = $el.getBoundingClientRect();
    //
    // return (
    //     rect.top >= 0 &&
    //     rect.left >= 0 &&
    //     rect.bottom <= ($viewport.clientHeight) &&
    //     rect.right <= ($viewport.clientWidth)
    // );
}