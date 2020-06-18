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
			let newSets = [...sets];
			newSets.unshift(stickerSet)
			this.set({
				sets: newSets
			})
		}
	}

	removeSet(stickerSet) { //maybe change to just id?
		if(this.contains(stickerSet)) {
			let newSets = sets.filter(set => set.id !== stickerSet.id);
			this.set({
				sets: newSets
			})
		}
	}

	contains(stickerSet) {
		for(let set of this.sets) {
			if(set.id === stickerSet.id) return true;
		}
		return false;
	}
}

export default new StickersState();