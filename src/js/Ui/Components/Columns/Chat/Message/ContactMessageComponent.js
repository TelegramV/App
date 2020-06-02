import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import CardMessageWrapperFragment from "./Common/CardMessageWrapperFragment"
import AvatarFragment from "../../../Basic/AvatarFragment"

class ContactMessageComponent extends GeneralMessageComponent {
    //TODO clickable photo and phone formatting
    render({message}) {
        return (
            <CardMessageWrapperFragment message={message} icon={<AvatarFragment peer={message.contact}/>}
                                        title={message.raw.media.first_name + (message.raw.media.last_name ? (" " + message.raw.media.last_name) : "")}
                                        description={message.raw.media.phone_number}
                                        bubbleRef={this.bubbleRef}/>
        )
    }
}

export default ContactMessageComponent;