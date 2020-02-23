import {handleDown, handleLeft, handleNone, handleRight, handleUp} from '../actions/moveHandlers';

export function getKeyHandler(event) {
    switch (event.keyCode) {
        case 37:
            return s => handleLeft(s);
        case 38:
            return s => handleUp(s);
        case 39:
            return s => handleRight(s);
        case 40:
            return s => handleDown(s);
        default:
            return s => handleNone(s);
    }
}
