import AppSelectedInfoPeer from "../../../../../reactive/SelectedInfoPeer";
import AppEvents from "../../../../../../api/eventBus/AppEvents";
import {UserPeer} from "../../../../../../api/dataObjects/peer/UserPeer";
import Component from "../../../../../v/vrdom/Component";
import {MTProto} from "../../../../../../mtproto/external";
import {FileAPI} from "../../../../../../api/fileAPI";
import {ObjectWithThumbnailComponent} from "../../../components/basic/objectWithThumbnailComponent";
import {PhotoComponent} from "../../../components/basic/photoComponent";

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

const loadObject = (photo, onProgress) => {
    const max = FileAPI.getMaxSize(photo)
    photo.real = {
        src: FileAPI.hasThumbnail(photo) ? FileAPI.getThumbnail(photo) : "",
        size: {width: max.w, height: max.h},
        thumbnail: true
    }

    return FileAPI.getFile(photo, max.type, onProgress).then(file => {
        photo.real.src = file
        photo.real.thumbnail = false
    })
}

const slotLoaded = (photo, real) => {
    return <div css-background-image={`url(${real.src})`}/>
}

const slotLoadingWidth = (photo, real) => {
    return <div css-background-image={`url(${real.src})`}/>
}

const slotLoadingHeight = (photo, real) => {
    return <div css-background-image={`url(${real.src})`}/>
}

const DialogInfoPhotoComponent = ({photo}) => {
    return <ObjectWithThumbnailComponent type="photo" loadObject={loadObject} object={photo} slotLoaded={slotLoaded}
                                         slotLoadingWidth={slotLoadingWidth} slotLoadingHeight={slotLoadingHeight}/>
}

const DialogInfoLinkComponent = ({title, description, url, photo, displayUrl, letter}) => {
    return <a className="link rp" href={url} target="_blank">
        {
            photo ?
                <PhotoComponent photo={photo}/>
            :
                <div className="photo letter">{letter}</div>
        }
        <div className="details">
            <span className="title">{title}</span>
            <span className="description">{description}</span>
            <a className="url">{displayUrl}</a>
        </div>
    </a>
}

class MaterialHeaderFragment extends Component {
    init() {
        super.init()
        this.state = {
            selected: 1
        }
    }

    h() {
        return <div className="header">
            <MaterialHeaderItemFragment text="Members" hidden click={this.select}/>
            <MaterialHeaderItemFragment text="Media" click={this.select}/>
            <MaterialHeaderItemFragment text="Docs" click={this.select}/>
            <MaterialHeaderItemFragment selected text="Links" click={this.select}/>
            <MaterialHeaderItemFragment text="Audio" click={this.select}/>
        </div>
    }

    select(ev) {
        console.log(ev)
    }
}

const MaterialHeaderItemFragment = ({selected = false, text, hidden = false, click}) => {
    return <div className={["item rp", selected ? "selected" : "", hidden ? "hidden" : ""]} onClick={click}><span>{text}</span></div>
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
                <div class="header toolbar">
                    <span class="btn-icon tgico tgico-close rp rps" onClick={this.close}/>
                    <div class="title">Info</div>
                    <span class="btn-icon tgico tgico-more rp rps"/>
                </div>
                <div class="content" onScroll={this.onScroll}>
                    <div class="photo-container">
                        <img class="photo" src=""/>
                    </div>

                    <DescriptionFragment name="" status=""/>


                    <DetailsFragment id="bio" icon="info" text="" label="Bio"/>
                    <DetailsFragment id="username" icon="username" text="" label="Username"/>
                    <DetailsFragment id="phone" icon="phone" text="" label="Phone"/>
                    <DetailsCheckboxFragment text="Notifications" label="Enabled"/>

                    <div class="materials">
                        <MaterialHeaderFragment/>
                        <div className="content">
                        </div>
                        <div className="content-loading">
                            <progress className="progress-circular big"/>
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
            $content: content.querySelector(".materials > .content"),
            $loader: content.querySelector(".materials > .content-loading")
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

    onScroll(event) {
        const $element = event.target

        if ($element.scrollHeight - 200 <= $element.clientHeight + $element.scrollTop && !this.state.isFetchingNextPage) {
            this.state.isFetchingNextPage = true

            this.fetchNextLinksPage(this.state.offsetId).finally(_ => {
                this.state.isFetchingNextPage = false
            })

            // TODO fetch next page
            // this.reactive.peer.api.fetchNextPage().then(() => {
            //     this.state.isFetchingNextPage = false
            //     this._toggleMessagesLoader(true)
            // })

        }
    }

    close() {
        this.$el.classList.add("hidden")
        this.state.hidden = true
    }

    fetchNextPhotoPage(offsetId = 0) {
        if(this.state.offsetId === -1) return Promise.resolve()

        console.log("fetchNextPhotoPage", offsetId)
        return this.fetchPage(offsetId, {
            _: "inputMessagesFilterPhotos"
        }).then(l => {
            l.messages.forEach(q => {
                this.addPhoto(q.media)
                this.state.offsetId = q.id
            })
        })
    }

    fetchNextLinksPage(offsetId = 0) {
        if(this.state.offsetId === -1) return Promise.resolve()

        console.log("fetchNextLinksPage", offsetId)
        return this.fetchPage(offsetId, {
            _: "inputMessagesFilterUrl"
        }).then(l => {
            l.messages.forEach(q => {
                console.log(q)
                // TODO fetch messageEntities urls
                if(q.media && q.media.webpage)
                this.addLink(q.media.webpage)
                this.state.offsetId = q.id
            })
        })
    }

    fetchPage(offsetId, filter) {
        if(this.state.offsetId === -1) return Promise.reject()
        const limit = 33

        return MTProto.invokeMethod("messages.search", {
            peer: this.state.peer.inputPeer,
            q: "",
            filter: filter,
            limit: limit, // /3
            offset_id: offsetId
        }).then(q => {
            if(q.messages.length < limit) {
                this.state.offsetId = -1
                this.elements.$loader.classList.add("hidden")
            } else {
                this.elements.$loader.classList.remove("hidden")
            }
            return q
        })
    }

    open(peer) {
        this.state.offsetId = 0
        this.state.hidden = false
        this.state.peer = peer

        this.resetContent()
        this.patchDescription()
        this.patchPhoto()
        this.patchBio()
        this.patchUsername()
        this.patchPhone()

        this.$el.classList.remove("hidden")

        peer.fetchFull()
        //this.fetchNextLinksPage()
        this.fetchNextPhotoPage()

    }

    resetContent() {
        while(this.elements.$content.firstChild) {
            this.elements.$content.removeChild(this.elements.$content.firstChild)
        }
    }

    addPhoto(photo) {
        VRDOM.append(<DialogInfoPhotoComponent photo={photo.photo}/>, this.elements.$content)
    }

    addLink(link) {
        const letter = link.site_name ? link.site_name[0] : ""
        VRDOM.append(<DialogInfoLinkComponent letter={letter} photo={link.photo} title={link.title} description={link.description} url={link.url} displayUrl={link.display_url}/>, this.elements.$content)
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