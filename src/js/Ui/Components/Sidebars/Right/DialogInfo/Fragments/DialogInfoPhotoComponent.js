import {FileAPI} from "../../../../../../Api/Files/FileAPI"
import {ObjectWithThumbnailComponent} from "../../../../Basic/objectWithThumbnailComponent"


// макс перепиши цю діч(


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
    return <div css-background-image={`url(${real.src})`}/>
}

const slotLoadingWidth = (photo, real) => {
    return <div css-background-image={`url(${real.src})`}/>
}

const slotLoadingHeight = (photo, real) => {
    return <div css-background-image={`url(${real.src})`}/>
}

export const DialogInfoPhotoComponent = ({photo, click}) => {
    return <ObjectWithThumbnailComponent type="photo" loadObject={loadObject} object={photo} slotLoaded={slotLoaded}
                                         slotLoadingWidth={slotLoadingWidth} slotLoadingHeight={slotLoadingHeight}
                                         click={click}/>
}