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
        return keval.getItem("topPeers").then(({time, topPeers, data}) => {
            this.updateTopPeers(topPeers);

            if (time < (new Date().getTime() - 60 * 60 * 1000)) {
                return API.contacts.getTopPeers({
                    correspondents: true,
                    limit: 5
                }).then(TopPeers => {
                    this.saveTopPeers(TopPeers);
                })
            }
        }).catch(() => {
            return API.contacts.getTopPeers({
                correspondents: true,
                limit: 5
            }).then(TopPeers => {
                this.saveTopPeers(TopPeers);
            })
        });
    }

    saveTopPeers(topPeers) {
        return keval.setItem("topPeers", {
            time: new Date().getTime(),
            topPeers: topPeers,
        }).finally(() => {
            this.updateTopPeers(topPeers);
        });
    }

    updateTopPeers = (topPeers) => {
        this.correspondents.clear();

        if (topPeers.categories) {
            topPeers.categories.forEach(TopPeerCategoryPeers => {
                if (TopPeerCategoryPeers.category._ === "topPeerCategoryCorrespondents") {
                    TopPeerCategoryPeers.peers.map(TopPeer => PeersStore.getByPeerType(TopPeer.peer))
                        .forEach(peer => this.correspondents.add(peer));

                    AppEvents.Peers.fire("gotCorrespondents", {
                        correspondents: this.correspondents
                    });
                }
            })
        }
    }
}

const TopPeers = new TopPeersManager()

export default TopPeers