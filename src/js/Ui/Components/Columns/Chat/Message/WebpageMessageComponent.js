import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import MessageWrapperFragment from "./Common/MessageWrapperFragment"
import TextWrapperComponent from "./Common/TextWrapperComponent"
import VUI from "../../../../VUI"
import BetterPhotoComponent from "../../../Basic/BetterPhotoComponent"

class WebpageMessageComponent extends GeneralMessageComponent {

    render({showDate}) {
        let webpage = this.props.message.raw.media.webpage;
        return (
            <MessageWrapperFragment message={this.props.message} bubbleRef={this.bubbleRef} showDate={showDate}>
                <TextWrapperComponent message={this.props.message}>
                    {webpage.url && <a href={webpage.url} target="_blank" className="box web rp">
                        <div className="quote">
                            {webpage.photo ? <BetterPhotoComponent photo={webpage.photo} calculateSize/> : ""}
                            {webpage.site_name ? <div className="name">{webpage.site_name}</div> : ""}
                            {webpage.title ? <div className="title">{webpage.title}</div> : ""}
                            {webpage.description ? <div className="text">{webpage.description}</div> : ""}
                        </div>
                    </a>}
                    {
                        webpage.cached_page
                        &&
                        <div className="instant-view-button"
                             onClick={() => VUI.InstantView.open(webpage.cached_page, webpage.site_name, webpage.photo)}>
                            Instant View
                        </div>
                    }

                </TextWrapperComponent>
            </MessageWrapperFragment>
        )
    }
}

export default WebpageMessageComponent