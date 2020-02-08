import GeneralMessageComponent from "./common/GeneralMessageComponent"
import CardMessageWrapperComponent from "./common/CardMessageWrapperComponent"

class ContactMessageComponent extends GeneralMessageComponent {

    h() {
        //TODO clickable, peer photo and phone formatting
        //let user = PeersStorage.get("user", message.media.user_id);
        return (
            <CardMessageWrapperComponent message={this.message} icon={<img class="contact-image" src=" "/>}
                                         title={this.message.raw.media.first_name + (this.message.raw.media.last_name ? (" " + this.message.raw.media.last_name) : "")}
                                         description={this.message.raw.media.phone_number} bubbleRef={this.bubbleRef}/>
        )
    }
}

export default ContactMessageComponent;