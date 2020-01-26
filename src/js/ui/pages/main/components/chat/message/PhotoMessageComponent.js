import MessageWrapperComponent from "./common/MessageWrapperComponent"
import TextWrapperComponent from "./common/TextWrapperComponent";
import GeneralMessageComponent from "./common/GeneralMessageComponent"
import {PhotoComponent} from "../../basic/photoComponent"

class PhotoMessageComponent extends GeneralMessageComponent {

    h() {
        return (
            <MessageWrapperComponent message={this.message} noPad>
                <PhotoComponent photo={this.message.raw.media.photo}/>

                <TextWrapperComponent message={this.message}/>
            </MessageWrapperComponent>
        )
    }
}

export default PhotoMessageComponent