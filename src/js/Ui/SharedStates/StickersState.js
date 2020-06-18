import SharedState from "../../V/VRDOM/component/SharedState"
import messages from "../../Api/Telegram/messages"

class StickersState extends SharedState {
	sets = [];

	get isFetched() {
		return !!this.sets.length;
	}

	fetchStickers() {
		if(this.isFetched) return;
		this.refetchStickers();
	}

	refetchStickers() {
		messages.getAllStickers().then(allStickers => {
			this.set({
				sets: allStickers.sets
			})
		})
	}

	addSet(stickerSet) {
		if(!this.contains(stickerSet)) {
			let newSets = [...this.sets];
			newSets.unshift(stickerSet)
			this.set({
				sets: newSets
			})
		}
	}

	removeSet(stickerSet) { //maybe change to just id?
		if(this.contains(stickerSet)) {
			let newSets = this.sets.filter(set => set.id !== stickerSet.id);
			this.set({
				sets: newSets
			})
		}
	}

	contains(stickerSet) {
		if(!stickerSet) return false;
		for(let set of this.sets) {
			if(set.id === stickerSet.id) return true;
		}
		return false;
	}

	updateOrder(order) {
		let newSets = [];
		for(let id of order) {
			let set = this.sets.find(set => set.id === id);
			if(set) {
				newSets.push(set);
			}
		}
		this.set({
			sets: newSets
		})
	}
}

export default new StickersState();