import MessageWrapperComponent from "./messageWrapperComponent"
import TextWrapperComponent from "./TextWrapperComponent";
import {FileAPI} from "../../../../../../api/fileAPI";
import {MediaViewerManager} from "../../../../../mediaViewerManager";
import Component from "../../../../../framework/vrdom/component";
import {PhotoComponent} from "../../basic/photoComponent";

// const MessageMediaImage = ({src, size, alt = "", isThumb}) => {
//     let width = isThumb ? parseInt(size[0]) >= 460 ? "460px" : `${size[0]}px` : parseInt(size[0]) >= 480 ? "480px" : `${size[0]}px`
//     return (
//         <img className={["attachment", isThumb ? "attachment-thumb" : ""]}
//              css-width={width}
//              src={src}
//              alt={alt}/>
//     )
// }
//
// function ImageMessageComponent({message, image = false}) {
//     let classes = "bubble"
//
//     if (message.isRead) {
//         classes += " read"
//     }
//
//     let haveMsg = message.text.length > 0
//
//     if (image) {
//         return (
//             <MessageWrapperComponent message={message}>
//                 <div class={classes}>
//                     {haveMsg ? (
//                         <div class="message">
//                             <MessageMediaImage src={image.imgSrc} size={image.imgSize} isThumb={!!image.thumbnail}/>
//                             <span dangerouslySetInnerHTML={message.text}/>
//                             <MessageTimeComponent message={message}/>
//                         </div>
//                     ) : ""}
//                 </div>
//             </MessageWrapperComponent>
//         )
//     }
//
//     return (
//         <MessageWrapperComponent message={message}>
//             <div class={classes}>
//                 {haveMsg ? (
//                     <div class="message">
//                         <img src="" class="attachment"/>
//                         <span dangerouslySetInnerHTML={message.text}/>
//                         <MessageTimeComponent message={message}/>
//                     </div>
//                 ) : ""}
//             </div>
//         </MessageWrapperComponent>
//     )
// }

const PhotoMessageComponent = ({message}) => {
    return (
        <MessageWrapperComponent message={message} noPad>
            <PhotoComponent photo={message.media.photo}/>

            <TextWrapperComponent message={message}/>
        </MessageWrapperComponent>
    )
}

export default PhotoMessageComponent