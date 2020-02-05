import {VComponent} from "../../../../../v/vrdom/component/VComponent"
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

export class DialogInfoComponent extends VComponent {

    hidden = true

    contentRefs = {
        media: VComponent.createRef(),
        links: VComponent.createRef(),
        docs: VComponent.createRef(),
    }

    contentPages = {
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

            this.open()
        }
    }

    h() {
        return (
            <div className={["dialog-info sidebar right", this.hidden ? "hidden" : ""]}>
                <div class="header toolbar">
                    <span class="btn-icon tgico tgico-close rp rps" onClick={this.close}/>
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

                        <div ref={this.contentRefs.media} className="content"/>
                        <div ref={this.contentRefs.links} className="content hidden"/>
                        <div ref={this.contentRefs.docs} className="content hidden"/>

                        <div ref={this.loadingRef} className="content-loading">
                            <progress className="progress-circular big"/>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    close = () => {
        this.$el.classList.add("hidden")
        this.hidden = true
    }

    open = () => {
        this.$el.classList.remove("hidden")
        this.hidden = false

        if (!AppSelectedInfoPeer.check(AppSelectedInfoPeer.Previous) && AppSelectedInfoPeer.Current !== undefined) {
            this.refreshContent()
        }
    }

    openMedia = () => {
        this.showRef("media")

        if (this.contentPages.media.offsetId === 0) {
            this.fetchMediaNextPage()
        }
    }

    fetchMediaNextPage() {
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

    appendLinkMessage = rawMessage => {
        if (rawMessage.id < this.contentPages.links.offsetId) {
            this.contentPages.links.offsetId = rawMessage.id
        }

        if (rawMessage.media && rawMessage.media.webpage) {
            const link = rawMessage.media.webpage
            const letter = link.site_name ? link.site_name[0] : ""

            VRDOM.append(<DialogInfoLinkComponent letter={letter}
                                                  photo={link.photo}
                                                  title={link.title}
                                                  description={link.description}
                                                  url={link.url}
                                                  displayUrl={link.display_url}/>, this.contentRefs.links.$el)
        }
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

                    if (Messages.count > 0) {
                        this.contentPages[refName].offsetId = Messages.messages[0].id
                    }

                    Messages.messages.forEach(message => appender(message))

                    if (Messages.count < this.defaultLimit) {
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
        this.openMedia()
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
            }
        }
    }
}