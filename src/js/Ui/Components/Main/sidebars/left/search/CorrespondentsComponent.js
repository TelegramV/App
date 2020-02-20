import VComponent from "../../../../../../V/VRDOM/component/VComponent"
import {PeopleListItemFragment} from "./PeopleListItemFragment"
import AppEvents from "../../../../../../Api/EventBus/AppEvents"
import TopPeers from "../../../../../../Api/Peers/TopPeers"

export class CorrespondentsComponent extends VComponent {

    hidden = false

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .on("gotCorrespondents", this.onGotCorrespondents)
            .on("updatePhotoSmall", this.onPeersUpdatePhotoSmall)
            .on("updatePhotoSmall", this.onPeersUpdatePhotoSmall)
    }

    render() {
        if (TopPeers.correspondents.size === 0) {
            return (
                <div className="people hidden section">
                    <div className="section-title">People</div>
                    <div className="people-list"/>
                </div>
            )
        }

        return (
            <div className="people section">
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
            this.forceUpdate()
        }
    }

    onGotCorrespondents = event => {
        this.forceUpdate()
    }
}