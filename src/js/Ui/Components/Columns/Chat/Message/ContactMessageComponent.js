import GeneralMessageComponent from "./Common/GeneralMessageComponent"
import CardMessageWrapperFragment from "./Common/CardMessageWrapperFragment"
import AvatarComponent from "../../../Basic/AvatarComponent"

class ContactMessageComponent extends GeneralMessageComponent {
    render({message}) {
        return (
            <CardMessageWrapperFragment message={message}
                                        icon={<AvatarComponent peer={message.contact}/>}
                                        title={message.raw.media.first_name + (message.raw.media.last_name ? (" " + message.raw.media.last_name) : "")}
                                        description={message.raw.media.phone_number}
                                        bubbleRef={this.bubbleRef}/>
        )
    }
}

export default ContactMessageComponent;