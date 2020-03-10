import {FileAPI} from "../../../Api/Files/FileAPI";
import {ObjectWithThumbnailComponent} from "./objectWithThumbnailComponent";

const loadObject = (video, onProgress) => {
    // FileAPI.getFile(message.media.document, "").then(data => {
    //     message.media.document.real = {url: data};
    //     VRDOM.patch($message, MessageComponentGeneral(message));
    // });
    const max = FileAPI.getMaxSize(video)
    video.real = {
        src: FileAPI.hasThumbnail(video) ? FileAPI.getThumbnail(video) : "",
        size: {width: max.w, height: max.h},
        thumbnail: true
    }

    return FileAPI.getFile(video, "", onProgress).then(file => {
        video.real.src = file
        video.real.thumbnail = false
    })
}

const slotLoaded = (video, real) => {
    const gif = FileAPI.getAttribute(video, "documentAttributeAnimated");
    const attribute = FileAPI.getAttribute(video, "documentAttributeVideo")
    if (attribute.round_message || gif) {
        return <video autoPlay muted loop onCanPlay={l => l.target.muted = true} src={real.src} type={video.mime_type}/>
    } else {
        return <video controls src={real.src} type={video.mime_type}/>
    }
}

const slotLoadingWidth = (video, real) => {
    return <img src={real.src} alt="" width={real.size.width ? real.size.width + "px" : ""}/>
}

const slotLoadingHeight = (video, real) => {
    return <img src={real.src} alt="" height={real.size.height ? real.size.height + "px" : ""}/>
}

export const VideoComponent = ({video, round = false}) => {
    return <ObjectWithThumbnailComponent type={round ? "round-video" : "video"} loadObject={loadObject} object={video}
                                         slotLoaded={slotLoaded}
                                         slotLoadingWidth={slotLoadingWidth} slotLoadingHeight={slotLoadingHeight}/>
}