import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import MessageWrapperFragment from "./Common/MessageWrapperFragment"
import TextWrapperComponent from "./Common/TextWrapperComponent"
import {PhotoComponent} from "../../../Basic/photoComponent"
import VUI from "../../../../VUI"
import {PhotoFigureFragment} from "./Photo/PhotoFigureFragment"
import VComponent from "../../../../../V/VRDOM/component/VComponent"

class FileImageComponent extends VComponent {
    reactive(R: RORC) {
        R.object(this.props.photo)
            .on("downloaded", this.forceUpdate);
    }

    render() {
        const photo = this.photo;

        return (
            <PhotoFigureFragment srcUrl={photo.srcUrl}
                                 width={photo.maxWidth}
                                 height={photo.maxHeight}
                                 maxWidth={470}
                                 maxHeight={512}
                                 loading={false}
                                 loaded={true}/>
        );
    }
}

class WebpageMessageComponent extends GeneralMessageComponent {

    render() {
        let webpage = this.message.raw.media.webpage;
        return (
            <MessageWrapperFragment message={this.message} showUsername={false} bubbleRef={this.bubbleRef}>
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
                                                onClick={l => VUI.InstantView.open(webpage.cached_page, webpage.site_name, webpage.photo)}>Instant
                        View</div> : ""}

                </TextWrapperComponent>
            </MessageWrapperFragment>
        )
    }
}

export default WebpageMessageComponent