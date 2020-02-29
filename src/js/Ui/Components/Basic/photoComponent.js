// Basic photo component

import {FileAPI} from "../../../Api/Files/FileAPI";
import {ObjectWithThumbnailComponent} from "./objectWithThumbnailComponent";

const loadObject = (photo, onProgress) => {
    const max = FileAPI.getMaxSize(photo)
    photo.real = {
        src: FileAPI.hasThumbnail(photo) ? FileAPI.getThumbnail(photo) : "",
        size: {width: max.w, height: max.h},
        thumbnail: true
    }

    return FileAPI.getFile(photo, max.type, onProgress).then(file => {
        photo.real.src = file
        photo.real.thumbnail = false
    })
}

const slotLoaded = (photo, real) => {
    return <img src={real.src} alt=""/>
}

const slotLoadingWidth = (photo, real) => {
    return <img src={real.src} alt="" width={real.size.width ? real.size.width + "px" : ""}/>
}

const slotLoadingHeight = (photo, real) => {
    return <img src={real.src} alt="" height={real.size.height ? real.size.height + "px" : ""}/>
}

export const PhotoComponent = ({photo}) => {
    return <ObjectWithThumbnailComponent type="photo" loadObject={loadObject} object={photo} slotLoaded={slotLoaded}
                                         slotLoadingWidth={slotLoadingWidth} slotLoadingHeight={slotLoadingHeight}/>
}