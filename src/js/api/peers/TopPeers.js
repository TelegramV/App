import {Manager} from "../manager"
import API from "../telegram/API"
import PeersStore from "../store/PeersStore"
import AppEvents from "../eventBus/AppEvents"
import {AppPermanentStorage} from "../common/storage"

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
            flags: 0,
            pFlags: {
                correspondents: true
            },
            limit: 5
        }).then(TopPeers => {
            TopPeers.categories.forEach(TopPeerCategoryPeers => {
                if (TopPeerCategoryPeers.category._ === "topPeerCategoryCorrespondents") {
                    AppPermanentStorage.setItem("topPeers", TopPeerCategoryPeers.peers)

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