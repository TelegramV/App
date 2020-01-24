import {FileAPI} from "../../../../../api/fileAPI";
import {ObjectWithThumbnailComponent} from "./objectWithThumbnailComponent";
import VRDOM from "../../../../framework/vrdom";

const loadObject = video => {
    console.log(video)
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

    return new Promise(resolve => {
         FileAPI.getFile(video).then(file => {
            video.real.src = file
            video.real.thumbnail = false
             setTimeout(resolve, 1000)
        })
    })
}

const slotLoaded = video => {
    // TODO  type={message.media.document.mime_type}
    return <video controls src={video.src}/>
}

const slotLoadingWidth = video => {
    return <img src={video.src} alt="" width={video.size.width ? video.size.width + "px" : ""}/>
}

const slotLoadingHeight = video => {
    return <img src={video.src} alt="" height={video.size.height ? video.size.height + "px" : ""}/>
}

export const VideoComponent = ({video}) => {
    return <ObjectWithThumbnailComponent type="video" loadObject={loadObject} object={video} slotLoaded={slotLoaded}
                                         slotLoadingWidth={slotLoadingWidth} slotLoadingHeight={slotLoadingHeight}/>
}