import {Manager} from "../Manager"
import API from "../Telegram/API"
import PeersStore from "../Store/PeersStore"
import AppEvents from "../EventBus/AppEvents"
import keval from "../../Keval/keval"

// todo: implement https://core.telegram.org/api/top-rating
class TopPeersManager extends Manager {

    correspondents = new Set()
    recent = new Set()

    init() {
        if (this._inited) {
            return
        }

        this.fetchCorrespondents()

        this._inited = true
    }

    fetchCorrespondents() {
        this.correspondents.clear()

        // if (AppPermanentStorage.exists("topPeers")) {
        //     AppPermanentStorage.getItem("topPeers")
        //         .map(TopPeer => PeersStore.getByPeerType(TopPeer.peer))
        //         .forEach(peer => this.correspondents.add(peer))
        //
        //     AppEvents.Peers.fire("gotCorrespondents", {
        //         correspondents: this.correspondents
        //     })
        //
        //     return Promise.resolve()
        // }

        return API.contacts.getTopPeers({
            correspondents: true,
            limit: 5
        }).then(TopPeers => {
            TopPeers.categories.forEach(TopPeerCategoryPeers => {
                if (TopPeerCategoryPeers.category._ === "topPeerCategoryCorrespondents") {
                    keval.setItem("topPeers", TopPeerCategoryPeers.peers)

                    TopPeerCategoryPeers.peers
                        .map(TopPeer => PeersStore.getByPeerType(TopPeer.peer))
                        .forEach(peer => this.correspondents.add(peer))

                    AppEvents.Peers.fire("gotCorrespondents", {
                        correspondents: this.correspondents
                    })
                }
            })
        })
    }
}

const TopPeers = new TopPeersManager()

export default TopPeers