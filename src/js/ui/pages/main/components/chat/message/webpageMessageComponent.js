import MessageWrapperComponent from "./messageWrapperComponent";
import TextWrapperComponent from "./textWrapperComponent";

const WebpageMessageComponent = ({ message }) => {
    let webpage = message.media.webpage;
    let photoUrl = "";
    if(webpage.photo && webpage.photo.real) {
        photoUrl = webpage.photo.real.url;
    }
    return (
        <MessageWrapperComponent message={message}>
            <div className="message">
                <TextWrapperComponent message={message}>
                    <a href={webpage.url} target="_blank" className="box web rp">
                        <div className="quote">
                            {photoUrl?<img className="preview" src={photoUrl}/>: ""}
                            {webpage.site_name?<div className="name">{webpage.site_name}</div>:""}
                            {webpage.title?<div className="title">{webpage.title}</div>: ""}
                            {webpage.description?<div className="text">{webpage.description}</div>: ""}
                        </div>
                    </a>
                </TextWrapperComponent>
            </div>
        </MessageWrapperComponent>
    )
}

export default WebpageMessageComponent