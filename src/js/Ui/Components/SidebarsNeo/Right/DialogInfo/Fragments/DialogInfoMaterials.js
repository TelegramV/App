import "./DialogInfoMaterials.scss";
import StatelessComponent from "../../../../../../V/VRDOM/component/StatelessComponent";
import TabSelectorComponent from "../../../../Tab/TabSelectorComponent";
import AppSelectedInfoPeer from "../../../../../Reactive/SelectedInfoPeer";
import PeersStore from "../../../../../../Api/Store/PeersStore";
import {MessageFactory} from "../../../../../../Api/Messages/MessageFactory";
import vrdom_append from "../../../../../../V/VRDOM/append";
import BetterPhotoComponent from "../../../../Basic/BetterPhotoComponent";
import UIEvents from "../../../../../EventBus/UIEvents";
import {FileAPI} from "../../../../../../Api/Files/FileAPI";
import {formatAudioTime} from "../../../../../Utils/utils";
import SearchManager from "../../../../../../Api/Search/SearchManager";
import VComponent from "../../../../../../V/VRDOM/component/VComponent";
import {MessageType} from "../../../../../../Api/Messages/Message"
import DocumentParser from "../../../../../../Api/Files/DocumentParser"
import {DialogInfoLinkComponent} from "./DialogInfoLinkComponent";
import {DialogInfoAudioComponent} from "./DialogInfoAudioComponent";
import DialogInfoDocumentComponent from "./DialogInfoDocumentComponent";
import {DialogInfoMemberComponent} from "./DialogInfoMemberComponent";

export class DialogInfoMaterials extends StatelessComponent {
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

    tabItems = []

    loadingRef = VComponent.createRef()
    tabSelectorRef = VComponent.createComponentRef()

    defaultLimit = 33

    render(props) {
        return <div className="materials">

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
    }

    update() {
        const showMembers = AppSelectedInfoPeer.Current.type === "chat" || (AppSelectedInfoPeer.Current.type === "channel" && AppSelectedInfoPeer.Current.isSupergroup)
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

                if (!l) return

                this.contentPages.members.offsetId += l.length

                if (l.length < this.defaultLimit) {
                    this.contentPages.members.offsetId = -1
                }
                l.forEach(member => this.appendMember(member))

            })
        }
    }

    appendMember = participant => {
        const peer = PeersStore.get("user", participant.user_id)
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
        this.fetchContentNextPage("media", "inputMessagesFilterPhotoVideo", this.appendMediaMessage)
    }

    appendMediaMessage = rawMessage => {
        if (rawMessage.id < this.contentPages.media.offsetId) {
            this.contentPages.media.offsetId = rawMessage.id
        }

        const message = MessageFactory.fromRawOrReturn(AppSelectedInfoPeer.Current, rawMessage)

        if (message.type === MessageType.VIDEO) {
            const video = DocumentParser.attributeVideo(message.raw.media.document)

            vrdom_append(
                <figure css-cursor="pointer" className="photo video-thumb rp thumbnail"
                        onClick={() => UIEvents.MediaViewer.fire("showMessage", {message: message})}>
                    <img src={FileAPI.getThumbnail(message.raw.media.document)} alt="video"/>
                    <div className="video-info-bar">
                        {formatAudioTime(video.duration)}
                    </div>
                </figure>,
                this.contentRefs.media.$el
            )
        } else {
            vrdom_append(
                <BetterPhotoComponent photo={message.raw.media.photo ? message.raw.media.photo : message.raw.media}
                                      onClick={() => UIEvents.MediaViewer.fire("showMessage", {message: message})}/>,
                this.contentRefs.media.$el
            )
        }
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

        const audio = FileAPI.getAttribute(rawMessage.media.document, "documentAttributeAudio")
        const time = formatAudioTime(audio.duration)
        const title = audio.title
        const performer = audio.performer
        const date = new Date(rawMessage.date * 1000).toLocaleString("en", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })

        const message = MessageFactory.fromRawOrReturn(AppSelectedInfoPeer.Current, rawMessage)

        VRDOM.append(<DialogInfoAudioComponent message={message}
                                               title={title}
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
        if (!empty) {
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
        if (refName === "members") {
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
            } else if (this.showing === "members") {
                this.fetchMembersNextPage()
            } else if (this.showing === "docs") {
                this.fetchDocsNextPage()
            } else if (this.showing === "audio") {
                this.fetchAudioNextPage()
            }
        }
    }

    shouldComponentUpdate(nextProps) {
        return false
    }
}