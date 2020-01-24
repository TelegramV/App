// Basic photo component

import {FileAPI} from "../../../../../api/fileAPI";
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
//
// export class PhotoComponent extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             photo: props.props.photo
//         }
//
//         const max = FileAPI.getMaxSize(this.state.photo)
//         this.state.photo.real = {
//             src: FileAPI.hasThumbnail(this.state.photo) ? FileAPI.getThumbnail(this.state.photo) : "",
//             size: {width: max.w, height: max.h},
//             thumbnail: true
//         }
//
//         FileAPI.getFile(this.state.photo, max.type).then(file => {
//             this.state.photo.real.src = file
//             this.state.photo.real.thumbnail = false
//             this.__patch()
//         })
//     }
//
//     h() {
//         const photo = this.state.photo.real
//         const thumb = photo.thumbnail
//         return <figure className={["photo", thumb ? "thumbnail" : ""]}>
//             {
//                 !thumb ?
//                 <img src={this.state.photo.real.src} alt=""/>
//                 :
//                     (photo.size.width > photo.size.height ?
//                     <img src={this.state.photo.real.src} alt="" width={photo.size.width ? photo.size.width + "px" : ""} />
//                     :
//                         <img src={this.state.photo.real.src} alt="" height={photo.size.height ? photo.size.height + "px" : ""} />
//                     )
//             }
//             {
//                 thumb ?
//                     <div className="progress">
//                         <div className="pause-button">
//                             <i className="tgico tgico-close"/>
//                         </div>
//                         <progress className="progress-circular big white"/>
//                     </div>
//                     : ""
//             }
//         </figure>
//     }
//
// }