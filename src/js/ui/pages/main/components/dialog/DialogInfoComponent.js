import AppSelectedInfoPeer from "../../../../reactive/SelectedInfoPeer";
import AppEvents from "../../../../../api/eventBus/AppEvents";
import {UserPeer} from "../../../../../api/dataObjects/peer/UserPeer";
import Component from "../../../../v/vrdom/Component";

const DetailsFragment = ({icon, text, label, hidden = false, id}) => {
    return <div className={["details", hidden ? "hidden" : ""]} id={id}>
        <span className={"icon tgico tgico-" + icon}/>
        <div className="line">
            <div className="text">{text}</div>
            <div className="label">{label}</div>
        </div>
    </div>
}

const DetailsCheckboxFragment = ({text, label}) => {
    return <div className="details">
        <div className="notifications-checkbox">
            <div className="checkbox-input">
                <label>
                    <input type="checkbox"/>
                    <span className="checkmark">
                        <div className="tgico tgico-check"/>
                    </span>
                </label>
            </div>
        </div>
        <div className="line">
            <div className="text">{text}</div>
            <div className="label">{label}</div>
        </div>
    </div>
}

const DescriptionFragment = ({name, status, isOnline}) => {
    return <div className="description">
        <div className="name">{name}</div>
        <div className={["status", isOnline ? "" : "offline"]}>{status}</div>
    </div>
}


export class DialogInfoComponent extends Component {
    constructor(props) {
        super(props);
    }

    init() {
        this.state = {
            hidden: true,
            peer: null
        }

        this.reactive = {
            peer: AppSelectedInfoPeer.Reactive.FireOnly,
        }

        this.appEvents = new Set([
            AppEvents.Peers.reactiveAny().FireOnly
        ])
    }

    reactiveChanged(key, value, event) {
        if (key === "peer") {
            this.open(value)
        }
    }

    h() {
        return (
            <div className={["dialog-info sidebar right", this.state.hidden ? "hidden" : ""]}>
                <div class="header">
                    <span class="btn-icon tgico tgico-close rp rps" onClick={this.close}/>
                    <div class="title">Info</div>
                    <span class="btn-icon tgico tgico-more rp rps"/>
                </div>
                <div class="content">
                    <div class="photo-container">
                        <img class="photo" src=""/>
                    </div>

                    <DescriptionFragment name="" status=""/>


                    <DetailsFragment id="bio" icon="info" text="" label="Bio"/>
                    <DetailsFragment id="username" icon="username" text="" label="Username"/>
                    <DetailsFragment id="phone" icon="phone" text="" label="Phone"/>
                    <DetailsCheckboxFragment text="Notifications" label="Enabled"/>

                    <div class="materials">
                        <div class="header">
                            <div class="item selected">Media</div>
                            <div class="item">Docs</div>
                            <div class="item">Links</div>
                            <div class="item">Audio</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    mounted() {
        const content = this.$el.querySelector(".content")
        this.elements = {
            $photo: content.querySelector(".photo-container img"),
            $description: content.querySelector(".description"),
            $bio: content.querySelector("#bio"),
            $phone: content.querySelector("#phone"),
            $username: content.querySelector("#username"),
        }
    }

    eventFired(bus, event) {
        if (bus === AppEvents.Peers) {
            if(AppSelectedInfoPeer.check(event.peer)) {
                // TODO don't call this if info is already there?
                if (event.type === "fullLoaded") {
                    this.patchBio()
                    this.patchDescription()
                } else if (event.type === "updateUserStatus") {
                    this.patchDescription()
                }

                console.log(event.type)
            }
        }
    }

    close() {
        this.$el.classList.add("hidden")
        this.state.hidden = true

    }

    open(peer) {
        // MTProto.invokeMethod("messages.search", {
        //     peer: peer.inputPeer,
        //     q: "",
        //     filter: {
        //         _: "inputMessagesFilterPhotos"
        //     },
        //     limit: 100
        // }).then(l => {
        //     console.log(l)
        // })
        this.state.hidden = false
        this.state.peer = peer

        this.patchDescription()
        this.patchPhoto()
        this.patchBio()
        this.patchUsername()
        this.patchPhone()

        this.$el.classList.remove("hidden")

        peer.fetchFull()
        //

    }

    patchDescription() {
        const name = this.state.peer.name
        if(this.state.peer.statusString.online) {
            VRDOM.patch(this.elements.$description, <DescriptionFragment name={name} status={this.state.peer.statusString.text} isOnline/>)
        } else {
            VRDOM.patch(this.elements.$description, <DescriptionFragment name={name} status={this.state.peer.statusString.text}/>)
        }
    }

    patchPhoto() {
        this.elements.$photo.src = this.state.peer.photo.smallUrl
    }

    patchUsername() {
        if(this.state.peer.username) {
            VRDOM.patch(this.elements.$username, <DetailsFragment id="username" icon="username"
                                                                  text={this.state.peer.username} label="Username"/>)
        } else {
            VRDOM.patch(this.elements.$username, <DetailsFragment id="username" icon="username" hidden label="Username"/>)
        }
    }

    patchPhone() {
        if(this.state.peer instanceof UserPeer && this.state.peer.phone) {
            VRDOM.patch(this.elements.$phone, <DetailsFragment id="phone" icon="phone"
                                                               text={this.state.peer.phone} label="Phone"/>)
        } else {
            VRDOM.patch(this.elements.$phone, <DetailsFragment id="phone" icon="phone" hidden label="Phone"/>)
        }
    }

    patchBio() {
        if(this.state.peer.full && this.state.peer.full.about) {
            VRDOM.patch(this.elements.$bio, <DetailsFragment id="bio" icon="info" text={this.state.peer.full.about}
                                                             label="Bio"/>)
        } else {
            VRDOM.patch(this.elements.$bio, <DetailsFragment id="bio" icon="info" hidden label="Bio"/>)
        }

    }
}