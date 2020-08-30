import {LeftSidebar} from "../LeftSidebar"
import VInput from "../../../../Elements/Input/VInput";
import {Section} from "../../Fragments/Section"
import Hint from "../../Fragments/Hint"
import UIEvents from "../../../../EventBus/UIEvents";
import AvatarUploadComponent from "../../../Basic/AvatarUploadComponent"
import API from "../../../../../Api/Telegram/API"
import {FileAPI} from "../../../../../Api/Files/FileAPI"

export class CreateChannelSidebar extends LeftSidebar {

	state = {
		name: "",
		description: "",
		avatarUrl: "",
		avatarBlob: null
	}

	content() {
		return (
			<this.contentWrapper>
				<AvatarUploadComponent onAvatarUpdated={this.onAvatarUpdate} url={this.state.avatarUrl}/>
				<Section>
					<VInput label="Channel Name" onInput={(event) => {
						this.setState({
							name: event.target.value
						})
					}} value={this.state.name}/>
					<VInput label="Description (optional)" onInput={(event) => {
						this.setState({
							description: event.target.value
						})
					}} value={this.state.description}/>
					<Hint>You can provide an optional description for your channel</Hint>
				</Section>
			</this.contentWrapper>
		)
	}

	onAvatarUpdate = (blob, url) => {
		this.setState({
			avatarUrl: url,
			avatarBlob: blob
		})
	}

	createChannel = () => {
		API.channels.createChannel(this.state.name, this.state.description, true).then(async Updates => {
			if(!this.state.avatarBlob) return;
			const chat = Updates.chats[0];
			const inputChannel = {
				_: "inputChannel",
				channel_id: chat.id,
				access_hash: chat.access_hash
			}
			const buffer = await this.state.avatarBlob.arrayBuffer();
			const inputPhoto = {
				_: "inputChatUploadedPhoto",
				file: await FileAPI.uploadFile(buffer, "avatar.jpeg")
			}
			window.location = "/#/?p=channel."+chat.id
			API.channels.editPhoto(inputChannel, inputPhoto)
		})
	}

	get rightButtons() {
		if(!this.state.name) return [];
		return [{
			icon: "check",
			blue: true,
			onClick: () => {
				UIEvents.Sidebars.fire("pop", this)
				this.createChannel()
			}
		}]
	}

	get title(): string | * {
        return this.l("lng_create_channel_title", {}, "New Channel")
    }
}