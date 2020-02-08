import VComponent from "../../../../../v/vrdom/component/VComponent"
import {PeopleListItemFragment} from "./PeopleListItemFragment"
import AppEvents from "../../../../../../api/eventBus/AppEvents"
import TopPeers from "../../../../../../api/peers/TopPeers"
import {VUI} from "../../../../../v/VUI"
import UIEvents from "../../../../../eventBus/UIEvents"

export class CorrespondentsComponent extends VComponent {

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .on("gotCorrespondents", this.onGotCorrespondents)
            .on("updatePhotoSmall", this.onPeersUpdatePhotoSmall)
            .on("updatePhotoSmall", this.onPeersUpdatePhotoSmall)

        E.bus(UIEvents.LeftSidebar)
            .on("searchInputUpdated", this.onSearchInputUpdated)
    }

    h() {
        if (TopPeers.correspondents.size === 0) {
            return (
                <div className="people hidden">
                    <div className="section-title">People</div>
                    <div className="people-list"/>
                </div>
            )
        }

        return (
            <div className="people">
                <div className="section-title">People</div>
                <div className="people-list">
                    {
                        Array.from(TopPeers.correspondents.values())
                            .map(c => <PeopleListItemFragment url={c.photo.smallUrl} name={c.name} peer={c}/>)
                    }
                </div>
            </div>
        )
    }

    onPeersUpdatePhotoSmall = event => {
        if (TopPeers.correspondents.has(event.peer)) {
            this.__patch()
        }
    }

    onGotCorrespondents = event => {
        this.__patch()
    }

    onSearchInputUpdated = (event) => {
        if (event.string.trim() === "") {
            VUI.showElement(this.$el)
        } else {
            VUI.hideElement(this.$el)
        }
    }
}