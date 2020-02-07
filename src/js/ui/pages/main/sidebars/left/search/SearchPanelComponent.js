import { VComponent } from "../../../../../v/vrdom/component/VComponent"
import { LeftBarComponent } from "../LeftBarComponent"

export class SearchPanelComponent extends LeftBarComponent {
    barName = "search"
    barVisible = false

    constructor(props) {
        super(props);
    }

    h() {
        return (
            <div class="sidebar scrollable search hidden">
				<div class="suggestions">
					<div class="people">
						<div class="section-title">People</div>
						<div class="people-list">
							<PeopleListItemFragment url="./static/images/logo.svg" name="Doggo"/>
							<PeopleListItemFragment url="./static/images/logo.svg" name="Doggo"/>
							<PeopleListItemFragment url="./static/images/logo.svg" name="Doggo"/>
							<PeopleListItemFragment url="./static/images/logo.svg" name="Doggo"/>
							<PeopleListItemFragment url="./static/images/logo.svg" name="Doggo"/>
						</div>
					</div>
					<div class="recent">
						<div class="section-title">Recent</div>
						<div class="column-list">
							<ContactFragment url={"./static/images/logo.svg"} name={"Doggo"} status={"online"}/>
							<ContactFragment url={"./static/images/logo.svg"} name={"Doggo"} status={"online"}/>
							<ContactFragment url={"./static/images/logo.svg"} name={"Doggo"} status={"online"}/>
							<ContactFragment url={"./static/images/logo.svg"} name={"Doggo"} status={"online"}/>
							<ContactFragment url={"./static/images/logo.svg"} name={"Doggo"} status={"online"}/>
						</div>
					</div>
				</div>
				<div class="search-results hidden">
					<div class="contacts-and-chats">
						<div class="section-title">Contacts and Chats</div>
						<div class="column-list">
							<ContactFragment url={"./static/images/logo.svg"} name={"Party"} status={"1337 members"}/>
							<ContactFragment url={"./static/images/logo.svg"} name={"Party"} status={"1337 members"}/>
						</div>
					</div>
					<div class="global-chats">
						<div class="section-title">Global search</div>
						<div class="column-list">
							<ContactFragment url={"./static/images/logo.svg"} name={"Party"} status={"@party"}/>
						</div>
					</div>
					<div class="global-messages">
						<div class="section-title">Global search</div>
					</div>
				</div>
			</div>
        )
    }

    barOnShow = () => {
        this.$el.classList.remove("hidden");
    }

    barOnHide = () => {
        this.$el.classList.add("hidden");
    }
}

    const PeopleListItemFragment = ({ url, name }) => {
        return (
            <div class="people-list-item">
			<div class="photo-container">
				<img src={url}/>
			</div>
			<div class="name">Doggo</div>
		</div>
        )
    }

    const ContactFragment = ({ url, name = " ", status }) => {
        return (
            <div class="contact">
			<div class="photo-container">
				<img src={url}/>
			</div>
			<div class="info-container">
				<div class="name">{name}</div>
				<div class="status">{status}</div>
			</div>
		</div>
        )
    }