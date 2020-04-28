import PeersStore from "../../Api/Store/PeersStore"
import {Peer} from "../../Api/Peers/Objects/Peer"
import MTProto from "../../MTProto/External"
import PeersManager from "../../Api/Peers/PeersManager"
import VApp from "../../V/vapp"
import UIEvents from "../EventBus/UIEvents"

function parseHashQuery(queryParams = undefined) {
    const p = queryParams ? queryParams.p : VApp.router.activeRoute.queryParams ? VApp.router.activeRoute.queryParams.p : undefined

    if (!p) {
        return {
            type: "",
            id: 0,
            invalid: true
        }
    }

    if (p.startsWith("@")) {
        return {
            username: p.substring(1)
        }
    }

    const queryPeer = p.split(".")

    if (queryPeer.length < 2) {
        return {
            invalid: true
        }
    }

    return {
        type: queryPeer[0],
        id: parseInt(queryPeer[1])
    }
}

class SelectedChat {
    constructor() {
        /**
         * @type {undefined|Peer}
         * @private
         */
        this._previousPeer = undefined

        /**
         * @type {undefined|Peer}
         * @private
         */
        this._peer = undefined

        // listen query changes
        VApp.router.onQueryChange(queryParams => {
            const p = parseHashQuery(queryParams)
            const peer = this.findFromQueryParams(p)

            if (!peer && !p.invalid) {
                this.resolveUsername()
                return
            }

            if (peer !== this._peer) {
                this._previousPeer = this._peer
                this._peer = peer

                this.fire(this._peer)
            }
        })

        VApp.router.onRouteChange(route => {
            this.resolveUsername()
        })

        PeersStore.onSet(({peer}) => {
            const p = parseHashQuery()

            if (p.invalid) {
                return
            }

            if (p.username) {
                if (p.username === peer.username) {
                    this._previousPeer = this._peer
                    this._peer = peer

                    this.fire(this._peer)
                }
            } else {
                if (peer.type === p.type && peer.id === p.id) {
                    this._previousPeer = this._peer
                    this._peer = peer

                    this.fire(this._peer)
                }
            }
        })
    }

    fire(peer = this._peer) {
        UIEvents.General.fire("chat.select", {
            peer
        })
    }

    resolveUsername() {
        const p = parseHashQuery()

        if (!p.invalid) {
            if (p.username) {
                const peer = this.findFromQueryParams(p)

                if (peer !== this._peer) {
                    MTProto.invokeMethod("contacts.resolveUsername", {
                        username: p.username
                    }).then(ResolvedPeer => {
                        PeersManager.fillPeersFromUpdate(ResolvedPeer)
                    })
                }
            }
        }
    }

    /**
     * @return {undefined|Peer}
     * @deprecated
     */
    get Previous() {
        return this._previousPeer
    }

    /**
     * @return {undefined|Peer}
     */
    get previous() {
        return this._previousPeer
    }

    /**
     * @deprecated
     * @return {undefined|Peer}
     */
    get Current() {
        return this._peer
    }

    /**
     * @return {undefined|Peer}
     */
    get current() {
        return this._peer
    }

    /**
     * @return {boolean}
     */
    get isSelected() {
        return this.Current instanceof Peer
    }

    /**
     * @return {boolean}
     */
    get isNotSelected() {
        return !this.isSelected
    }

    /**
     * @param p
     * @return {Peer|undefined|boolean}
     */
    findFromQueryParams(p) {
        if (!p.invalid) {

            if (p.username) {
                return PeersStore.getByUsername(p.username)
            } else {
                return PeersStore.get(p.type, p.id)
            }

        } else {
            return undefined
        }
    }

    /**
     * @param {Peer} peer
     */
    select(peer) {
        const p = peer.username ? `@${peer.username}` : `${peer.type}.${peer.id}`

        VApp.router.push("/", {
            queryParams: {
                p
            }
        })
    }

    /**
     * Checks whether the given peer is selected.
     *
     * Warning: it checks directly by `===`!
     *
     * @param {Peer} peer
     * @return {boolean}
     */
    check(peer) {
        if (!this.Current || !peer) {
            return false
        }

        return this.Current === peer || (this.Current.type === peer.type && this.Current.id === peer.id)
    }
}

const AppSelectedChat = new SelectedChat()

export default AppSelectedChat