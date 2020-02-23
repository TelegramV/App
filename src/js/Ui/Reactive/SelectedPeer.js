import VF from "../../V/VFramework"
import ReactiveCallback from "../../V/Reactive/ReactiveCallback"
import PeersStore from "../../Api/Store/PeersStore"
import {Peer} from "../../Api/Peers/Objects/Peer"
import MTProto from "../../MTProto/external"
import PeersManager from "../../Api/Peers/Objects/PeersManager"

function parseHashQuery(queryParams = undefined) {
    const p = queryParams ? queryParams.p : VF.router.activeRoute.queryParams ? VF.router.activeRoute.queryParams.p : undefined

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

class SelectedPeer {
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

        /**
         * @type {Set<function(Peer)>}
         * @private
         */
        this._subscribers = new Set()

        /**
         * @type {{Default: Peer, FireOnly: Peer, PatchOnly: Peer}}
         * @private
         */
        this._Reactive = ReactiveCallback(subscription => {
            this.subscribe(subscription)
            this._previousPeer = this._peer
            this._peer = this.findFromQueryParams(parseHashQuery())
            return this._peer
        }, subscription => {
            this.unsubscribe(subscription)
        })

        // listen query changes
        VF.router.onQueryChange(queryParams => {
            const p = parseHashQuery(queryParams)
            const peer = this.findFromQueryParams(p)

            if (!peer && !p.invalid) {
                this.resolveUsername()
                return
            }

            if (peer !== this._peer) {
                this._previousPeer = this._peer
                this._peer = peer

                this._subscribers.forEach(listener => {
                    listener(this._peer)
                })
            }
        })

        VF.router.onRouteChange(route => {
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

                    this._subscribers.forEach(listener => {
                        listener(this._peer)
                    })
                }
            } else {
                if (peer.type === p.type && peer.id === p.id) {
                    this._previousPeer = this._peer
                    this._peer = peer

                    this._subscribers.forEach(listener => {
                        listener(this._peer)
                    })
                }
            }
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
     */
    get Previous() {
        return this._previousPeer
    }

    /**
     * @return {undefined|Peer}
     */
    get Current() {
        return this._peer
    }

    /**
     * @return {{Default: Peer, FireOnly: Peer, PatchOnly: Peer}}
     * @constructor
     */
    get Reactive() {
        return this._Reactive
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
     * @param {function(peer: Peer)} resolve
     */
    subscribe(resolve) {
        this._subscribers.add(resolve)
    }

    /**
     * @param {function(peer: Peer)} resolve
     */
    unsubscribe(resolve) {
        this._subscribers.delete(resolve)
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

        VF.router.push("/", {
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

const AppSelectedPeer = new SelectedPeer()

export default AppSelectedPeer