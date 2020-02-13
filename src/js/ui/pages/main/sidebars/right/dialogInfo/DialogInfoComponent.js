import {VComponent} from "../../../../../v/vrdom/component/VComponent"
import {RightBarComponent} from "../RightBarComponent"
import AppSelectedInfoPeer from "../../../../../reactive/SelectedInfoPeer"
import {DialogInfoAvatarComponent} from "./DialogInfoAvatarComponent"
import {DialogInfoDescriptionComponent} from "./DialogInfoDescriptionComponent"
import {DialogInfoBioComponent} from "./DialogInfoBioComponent"
import {DialogInfoUsernameComponent} from "./DialogInfoUsernameComponent"
import {DialogInfoPhoneComponent} from "./DialogInfoPhoneComponent"
import {DialogInfoNotficationStatusComponent} from "./DialogInfoNotficationStatusComponent"
import TabSelectorComponent from "../../../components/basic/TabSelectorComponent"
import {DialogInfoPhotoComponent} from "./fragments/DialogInfoPhotoComponent"
import {DialogInfoLinkComponent} from "./fragments/DialogInfoLinkComponent"
import {DialogInfoDocumentComponent} from "./fragments/DialogInfoDocumentComponent"
import SearchManager from "../../../../../../api/search/SearchManager"
import {GroupPeer} from "../../../../../../api/peers/objects/GroupPeer";
import {SupergroupPeer} from "../../../../../../api/peers/objects/SupergroupPeer";
import PeersManager from "../../../../../../api/peers/objects/PeersManager";
import {DialogInfoMemberComponent} from "./fragments/DialogInfoMemberComponent";
import {DialogInfoAudioComponent} from "./fragments/DialogInfoAudioComponent";
import {FileAPI} from "../../../../../../api/fileAPI";
import {formatAudioTime} from "../../../../../utils";

export class DialogInfoComponent extends RightBarComponent {

    barName = "dialog-info"
    barVisible = false

    contentRefs = {
        media: VComponent.createRef(),
        members: VComponent.createRef(),
        links: VComponent.createRef(),
        docs: VComponent.createRef(),
        audio: VComponent.createRef(),
    }

    contentPages = {
        members: {
            offsetId: 0,
            isFetching: false
        },
        media: {
            offsetId: 0,
            isFetching: false,
        },
        links: {
            offsetId: 0,
            isFetching: false,
        },
        docs: {
            offsetId: 0,
            isFetching: false,
        },
        audio: {
            offsetId: 0,
            isFetching: false,
        },
    }

    loadingRef = VComponent.createRef()
    tabSelectorRef = VComponent.createComponentRef()

    defaultLimit = 33

    showing = "media"

    init() {
        this.tabItems = [
            {
                text: "Members",
                hidden: true,
            },
            {
                text: "Media",
                click: this.openMedia,
                selected: true
            },
            {
                text: "Docs",
                click: this.openDocs,
            },
            {
                text: "Links",
                click: this.openLinks,
            },
            {
                text: "Audio",
            }
        ]

        this.callbacks = {
            peer: AppSelectedInfoPeer.Reactive.FireOnly
        }
    }

    callbackChanged(key: string, value) {
        if (this.callbacks.peer) {
            if (!this.callbacks.peer.full) {
                this.callbacks.peer.fetchFull()
            }

            const showMembers = this.callbacks.peer instanceof GroupPeer || this.callbacks.peer instanceof SupergroupPeer
            this.tabItems = [
                {
                    text: "Members",
                    hidden: !showMembers,
                    selected: showMembers,
                    click: this.openMembers,
                },
                {
                    text: "Media",
                    click: this.openMedia,
                    selected: !showMembers
                },
                {
                    text: "Docs",
                    click: this.openDocs,
                },
                {
                    text: "Links",
                    click: this.openLinks,
                },
                {
                    text: "Audio",
                    click: this.openAudio,
                }
            ]
            this.tabSelectorRef.component.updateFragments(this.tabItems)

            if (!AppSelectedInfoPeer.check(AppSelectedInfoPeer.Previous) && AppSelectedInfoPeer.Current !== undefined) {
                this.refreshContent()
            }

            if (!this.barVisible) {
                this.openBar()
            }
        }
    }

    h() {
        return (
            <div className="dialog-info sidebar right hidden">
                <div class="header toolbar">
                    <span class="btn-icon tgico tgico-close rp rps" onClick={_ => this.hideBar()}/>
                    <div class="title">Info</div>
                    <span class="btn-icon tgico tgico-more rp rps"/>
                </div>

                <div class="content scrollable" onScroll={this.onScroll}>
                    <DialogInfoAvatarComponent/>

                    <DialogInfoDescriptionComponent/>

                    <DialogInfoBioComponent/>
                    <DialogInfoUsernameComponent/>
                    <DialogInfoPhoneComponent/>

                    <DialogInfoNotficationStatusComponent/>

                    <div class="materials">

                        <TabSelectorComponent ref={this.tabSelectorRef} items={this.tabItems}/>

                        <div ref={this.contentRefs.members} className="content hidden member-list"/>
                        <div ref={this.contentRefs.media} className="content"/>
                        <div ref={this.contentRefs.links} className="content hidden"/>
                        <div ref={this.contentRefs.docs} className="content hidden docs-list"/>
                        <div ref={this.contentRefs.audio} className="content hidden audio-list"/>

                        <div ref={this.loadingRef} className="content-loading">
                            <progress className="progress-circular big"/>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    openMembers = () => {
        this.showRef("members")

        if (this.contentPages.members.offsetId === 0) {
            this.fetchMembersNextPage()
        }
    }

    fetchMembersNextPage = _ => {
        if (!this.contentPages.members.isFetching && AppSelectedInfoPeer.Current && this.contentPages.members.offsetId !== -1) {
            this.contentPages.members.isFetching = true

            this.toggleContentLoading(true)

            AppSelectedInfoPeer.Current.api.fetchParticipants(this.contentPages.members.offsetId, this.defaultLimit).then(l => {
                this.toggleContentLoading(false)
                this.contentPages.members.isFetching = false

                if(!l) return

                this.contentPages.members.offsetId += l.length

                if(l.length < this.defaultLimit) {
                    this.contentPages.members.offsetId = -1
                }
                l.forEach(member => this.appendMember(member))

            })
        }
    }

    appendMember = participant => {
        const peer = Peers.get("user", participant.user_id)
        // if (rawMessage.id < this.contentPages.media.offsetId) {
        //     this.contentPages.media.offsetId = rawMessage.id
        // }

        VRDOM.append(<DialogInfoMemberComponent peer={peer}/>, this.contentRefs.members.$el)
    }

    openMedia = () => {
        this.showRef("media")

        if (this.contentPages.media.offsetId === 0) {
            this.fetchMediaNextPage()
        }
    }

    fetchMediaNextPage = () => {
        this.fetchContentNextPage("media", "inputMessagesFilterPhotos", this.appendMediaMessage)
    }

    appendMediaMessage = rawMessage => {
        if (rawMessage.id < this.contentPages.media.offsetId) {
            this.contentPages.media.offsetId = rawMessage.id
        }

        VRDOM.append(<DialogInfoPhotoComponent photo={rawMessage.media.photo}/>, this.contentRefs.media.$el)
    }

    openLinks = () => {
        this.showRef("links")

        if (this.contentPages.links.offsetId === 0) {
            this.fetchLinksNextPage()
        }
    }

    fetchLinksNextPage = () => {
        this.fetchContentNextPage("links", "inputMessagesFilterUrl", this.appendLinkMessage)
    }

    openAudio = () => {
        this.showRef("audio")

        if (this.contentPages.audio.offsetId === 0) {
            this.fetchAudioNextPage()
        }
    }

    fetchAudioNextPage = () => {
        this.fetchContentNextPage("audio", "inputMessagesFilterMusic", this.appendAudioMessage)
    }

    appendAudioMessage = rawMessage => {
        if (rawMessage.id < this.contentPages.audio.offsetId) {
            this.contentPages.audio.offsetId = rawMessage.id
        }
        console.log(rawMessage)
        const audio = FileAPI.getAttribute(rawMessage.media.document, "documentAttributeAudio")
        const time = formatAudioTime(audio.duration)
        const title = audio.title
        const performer = audio.performer
        const date =  new Date(rawMessage.date * 1000).toLocaleString("en", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })

        VRDOM.append(<DialogInfoAudioComponent title={title}
                                              description={`${performer} · ${date}`}
                                              time={time}/>, this.contentRefs.audio.$el)
    }

    appendLinkMessage = rawMessage => {
        if (rawMessage.id < this.contentPages.links.offsetId) {
            this.contentPages.links.offsetId = rawMessage.id
        }

        const empty = !rawMessage.media || !rawMessage.media.webpage || rawMessage.media.webpage._ === "webPageEmpty"
        let photo = null
        let title = null
        let description = null
        let url = null
        let displayUrl = null
        let letter = rawMessage.message[0]
        if(!empty) {
            const link = rawMessage.media.webpage
            photo = link.photo
            title = link.title
            description = link.description
            url = link.url
            displayUrl = link.display_url
            letter = link.site_name ? link.site_name[0] : ""
        } else {
            return
        }

        description = description || rawMessage.message
        title = title || "No title"
        displayUrl = displayUrl || url

        VRDOM.append(<DialogInfoLinkComponent letter={letter}
                                              photo={photo}
                                              title={title}
                                              description={description}
                                              url={url}
                                              displayUrl={displayUrl}/>, this.contentRefs.links.$el)
    }

    openDocs = () => {
        this.showRef("docs")

        if (this.contentPages.docs.offsetId === 0) {
            this.fetchDocsNextPage()
        }
    }

    fetchDocsNextPage = () => {
        this.fetchContentNextPage("docs", "inputMessagesFilterDocument", this.appendDocumentMessage)
    }

    fetchContentNextPage = (refName, filter, appender) => {
        if(refName === "members") {
            return this.fetchMembersNextPage()
        }
        if (!this.contentPages[refName].isFetching && AppSelectedInfoPeer.Current && this.contentPages[refName].offsetId !== -1) {
            this.contentPages[refName].isFetching = true

            this.toggleContentLoading(true)

            SearchManager.searchMessages(AppSelectedInfoPeer.Current, {
                offsetId: this.contentPages[refName].offsetId,
                filter: {
                    _: filter
                }
            }).then(Messages => {
                if (Messages._peer === AppSelectedInfoPeer.Current) {
                    this.toggleContentLoading(false)

                    if (Messages.current_count > 0) {
                        this.contentPages[refName].offsetId = Messages.messages[0].id
                    }

                    Messages.messages.forEach(message => appender(message))

                    if (Messages.current_count < this.defaultLimit) {
                        this.contentPages[refName].offsetId = -1
                    }

                    this.contentPages[refName].isFetching = false
                }
            })
        }
    }



    appendDocumentMessage = rawMessage => {
        if (rawMessage.id < this.contentPages.docs.offsetId) {
            this.contentPages.docs.offsetId = rawMessage.id
        }

        if (rawMessage.media && rawMessage.media.document) {
            VRDOM.append(<DialogInfoDocumentComponent document={rawMessage.media.document}/>, this.contentRefs.docs.$el)
        }
    }

    refreshContent = () => {
        this.nullContentPages()
        this.clearContent()
        this.toggleContentLoading(true)
        this.tabItems.find(l => !l.hidden).click()
        this.toggleContentLoading(false)
    }

    showRef = refName => {
        for (const [k, v] of Object.entries(this.contentRefs)) {
            if (k !== refName) {
                v.$el.classList.add("hidden")
                v.$el.classList.remove("content")
            }
        }

        this.contentRefs[refName].$el.classList.add("content")
        this.contentRefs[refName].$el.classList.remove("hidden")
        this.showing = refName
    }

    toggleContentLoading = (enable = false) => {
        if (enable) {
            this.loadingRef.$el.classList.remove("hidden")
        } else {
            this.loadingRef.$el.classList.add("hidden")
        }
    }

    clearContent = () => {
        for (const v of Object.values(this.contentRefs)) {
            VRDOM.deleteInner(v.$el)
        }
    }

    nullContentPages = () => {
        for (const k of Object.keys(this.contentPages)) {
            this.contentPages[k].offsetId = 0
            this.contentPages[k].isFetching = false
        }
    }

    onScroll = (event) => {
        const $element = event.target
        const pageShowing = this.contentPages[this.showing]

        if ($element.scrollHeight - 200 <= $element.clientHeight + $element.scrollTop && !pageShowing.isFetching) {
            if (this.showing === "media") {
                this.fetchMediaNextPage()
            } else if (this.showing === "links") {
                this.fetchLinksNextPage()
            } else if(this.showing === "members") {
                this.fetchMembersNextPage()
            } else if(this.showing === "docs") {
                this.fetchDocsNextPage()
            } else if(this.showing === "audio") {
                this.fetchAudioNextPage()
            }
        }
    }
}