import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import CardMessageWrapperFragment from "./Common/CardMessageWrapperFragment"

class ContactMessageComponent extends GeneralMessageComponent {

    render({message}) {
        //TODO clickable, peer photo and phone formatting
        //let user = PeersStorage.get("user", message.media.user_id);
        return (
            <CardMessageWrapperFragment message={message} icon={<img class="contact-image" src=" "/>}
                                        title={message.raw.media.first_name + (message.raw.media.last_name ? (" " + message.raw.media.last_name) : "")}
                                        description={message.raw.media.phone_number}
                                        bubbleRef={this.bubbleRef}/>
        )
    }
}

export default ContactMessageComponent;