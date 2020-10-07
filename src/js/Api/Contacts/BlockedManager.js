import API from "../Telegram/API"
import PeersStore from "../Store/PeersStore"
import AppEvents from "../EventBus/AppEvents"

class BlockedManager {

	blocked = []
	nextOffset = 0;

	defaultSliceSize = 50

	totalBlockedCount = 0

	init() {
		this.refetchBlocked();
		window.blocked = this;
	}

	block(user) {
		API.contacts.block(user).then(() => {
			this._updateUserBlock(user, true)
			AppEvents.Peers.fire("contacts.blocked", {
		    	peer: user,
		    	status: true
		    })
		})
	}

	unblock(user) {
		API.contacts.unblock(user).then(() => {
			this._updateUserBlock(user, false)
			AppEvents.Peers.fire("contacts.blocked", {
		    	peer: user,
		    	status: false
		    })
		})
	}

	getBlocked() {
		return this.blocked
	}

	isBlocked(user) {
		const id = user.user_id || user.id;
		return !!this.blocked.find(usr => usr.id === id);
	}

	getTotalCount() {
		return this.totalBlockedCount
	}

	refetchBlocked() {
		this.blocked = [];
		this.nextOffset = 0;
		API.contacts.getBlocked(this.defaultSliceSize, this.nextOffset).then((list) => {
			if(list._==="contacts.blocked") {
				this._addBlocked(list.blocked)
				this.totalBlockedCount = this.blocked.length
			} else {
				this._addBlocked(list.blocked)
				this.totalBlockedCount = list.count;
				this.nextOffset = this.defaultSliceSize;
				this.fetchAll();
			}
			
		})
	}

	fetchAll() {
		API.contacts.getBlocked(this.defaultSliceSize, this.nextOffset).then(list => {
			if(list.blocked.length === 0) {
				return;
			}
			this._addBlocked(list.blocked)
			this.nextOffset += this.defaultSliceSize
			this.fetchAll();
		})
	}

	_updateUserBlock(peer, blocked) {
		if(blocked) {
			this.blocked = [...this.blocked, peer]; // force change of reference, to make setState work properly
		} else {
			this.blocked = this.blocked.filter(user => user.id !== peer.id)
		}
	}

	_addBlocked(list) {
		this.blocked = this.blocked.concat(list.map(user => PeersStore.get("user", user.user_id)))
	}

}

export default new BlockedManager();