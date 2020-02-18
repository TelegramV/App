import { handleDown, handleLeft, handleUp, handleRight, handleNone } from '../actions/moveHandlers';

export function getTouchHandler(event, touchStartCoordinates) {
    let touch = event.changedTouches[0];
    if (!touch)
        return handleNone;

    let xDiff = touch.clientX - touchStartCoordinates.X;
    let yDiff = touch.clientY - touchStartCoordinates.Y;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {

        if (xDiff > 0) {
            return handleRight;
        }

        if (xDiff < 0) {
            return handleLeft;
        }
    }
    else {

        if (yDiff > 0) {
            return handleDown;
        }

        if (yDiff < 0) {
            return handleUp;
        }
    }

    return handleNone;
}
