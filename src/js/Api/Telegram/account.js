/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import MTProto from "../../MTProto/External"
import PeersStore from "../Store/PeersStore"
import AppEvents from "../EventBus/AppEvents"

function getPassword() {
    return MTProto.invokeMethod("account.getPassword");
}

function getAuthorizations() {
	return MTProto.invokeMethod("account.getAuthorizations");
}

function resetAuthorization(hash) {
	return MTProto.invokeMethod("account.resetAuthorization", {
		hash
	});
}

function updateProfile(first_name="", last_name="", about="") {
	return MTProto.invokeMethod("account.updateProfile", {
		first_name,
		last_name,
		about
	}).then(user => {
		const self = PeersStore.self()
		if(self) {
			self.fillRaw(user);
			AppEvents.Peers.fire("updateName", {peer: self})
			AppEvents.Peers.fire("peer.update", {peer: self})
			AppEvents.Peers.fire("peer.updateName", {peer: self})
			AppEvents.Peers.fire("peer.updateBio", {peer: self})
		}
	})
}

function uploadProfilePhoto(file, video = null, videoStart = null) {
	return MTProto.invokeMethod("photos.uploadProfilePhoto", {
		file,
		video,
		video_start_ts: videoStart
	}).then(photo => {
		const self = PeersStore.self();
		if(self) {
			self._full = null
			self.fetchFull();
			self.photo.clearCache();
			self.photo.fillFull(photo);
			AppEvents.Peers.fire("updatePhoto", {peer: self})
		}
	})
}

function checkUsername(username) {
	return MTProto.invokeMethod("account.checkUsername", {
		username
	})
}

function updateUsername(username) {
	return MTProto.invokeMethod("account.updateUsername", {
		username
	}).then(user => {
		const self = PeersStore.self()
		if(self) {
			self.fillRaw(user);
			AppEvents.Peers.fire("peer.update", {peer: self})
			AppEvents.Peers.fire("peer.updateUsername", {peer: self})
		}
	})
}

const account = {
    getPassword,
    getAuthorizations,
    resetAuthorization,
    updateProfile,
    uploadProfilePhoto,
    checkUsername,
    updateUsername
};

export default account;