import GeneralMessageComponent from "./common/GeneralMessageComponent"
import MessageWrapperFragment from "./common/MessageWrapperFragment"
import TextWrapperComponent from "./common/TextWrapperComponent"
import {PhotoComponent} from "../../basic/photoComponent"
import {InstantViewManager} from "../../../../../instantViewManager"

class WebpageMessageComponent extends GeneralMessageComponent {

    h() {
        let webpage = this.message.raw.media.webpage;
        return (
            <MessageWrapperFragment message={this.message} showUsername={false}>
                <TextWrapperComponent message={this.message}>
                    <a href={webpage.url} target="_blank" className="box web rp">
                        <div className="quote">
                            {webpage.photo ? <PhotoComponent photo={webpage.photo}/> : ""}
                            {webpage.site_name ? <div className="name">{webpage.site_name}</div> : ""}
                            {webpage.title ? <div className="title">{webpage.title}</div> : ""}
                            {webpage.description ? <div className="text">{webpage.description}</div> : ""}
                        </div>
                    </a>
                    {webpage.cached_page ? <div className="instant-view-button"
                                                onClick={l => InstantViewManager.open(webpage.cached_page, webpage.site_name, webpage.photo)}>Instant
                        View</div> : ""}

                </TextWrapperComponent>
            </MessageWrapperFragment>
        )
    }
}

export default WebpageMessageComponent