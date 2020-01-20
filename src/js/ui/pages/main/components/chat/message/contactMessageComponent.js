import CardMessageComponent from "./cardMessageComponent";

const ContactMessageComponent = ({ message }) => {
    //TODO clickable, peer photo and phone formatting
    //let user = PeersStorage.get("user", message.media.user_id);
    return (
    	<CardMessageComponent message={message} icon={<img class="contact-image" src=" "/>} 
    	title={message.media.first_name + (message.media.last_name? (" "+message.media.last_name) : "")} 
    	description={message.media.phone_number}/>
    )
}

export default ContactMessageComponent;