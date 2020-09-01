import UIEvents from "../EventBus/UIEvents"
import {FileAPI} from "../../Api/Files/FileAPI"

export function mediaViewerOpen($media, message) {
    const loc = $media.getBoundingClientRect()
    const ghost = $media.cloneNode(true);
    ghost.style.cssText = `position: fixed;
                            z-index: 99999;
                            top: ${loc.y}px;
                            left: ${loc.x}px;
                            width: ${loc.width}px;
                            height: ${loc.height}px;
                            filter: blur(0);
                            transition: transform 0.3s ease-in-out, top 0.3s ease-in-out, left 0.3s ease-in-out, opacity 1s ease, filter 1s ease;`
    document.body.appendChild(ghost)
    setTimeout(() => {
        const newCoords = calculateCenter(loc.width, loc.height);
        ghost.style.left = `${newCoords.x}px`;
        ghost.style.top = `${newCoords.y}px`;
        ghost.style.transform = `scale(${calculateScale(loc.width, loc.height, message)})`;
        //ghost.style.opacity = "0.8";
        ghost.style.filter = "blur(5px)";
        setTimeout(() => {
            UIEvents.MediaViewer.fire("showMessage", {message});
            ghost.remove();
        }, 300)
    }, 150)
}

function calculateScale(width, height, message) {
    const maxWidth = window.innerWidth*0.8
    const maxHeight = window.innerHeight*0.8

    const size = FileAPI.getMaxSize(message.media.video || message.media.photo || message.media.document || message.media, false);
    if(!size) return Math.min(maxWidth/width, maxHeight/height);

    const finalWidth = Math.min(maxWidth, size.w)
    const finalHeight = Math.min(maxHeight, size.h)
    return Math.min(finalWidth/width, finalHeight/height)

}

function calculateCenter(width, height) {
    const x = (window.innerWidth-width)/2
    const y = (window.innerHeight-height)/2
    return {x, y}
}