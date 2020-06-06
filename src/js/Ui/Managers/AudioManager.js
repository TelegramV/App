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
import UIEvents from "../EventBus/UIEvents";

class AudioManagerSingleton {
    constructor() {
        this.active = null;

        this.notifications = {
            "notification": "/static/notification.mp3",
            "out": "/static/sound_out.mp3",
            "in": "/static/sound_in.mp3",
            "call_busy": "/static/call_busy.mp3",
            "call_connect": "/static/call_connect.mp3",
            "call_end": "/static/call_end.mp3",
            "call_incoming": "/static/call_incoming.mp3",
            "call_outgoing": "/static/call_outgoing.mp3",
        }

        this._bindNavigatorEvents();
    }

    playNotification(sound) {
        //TODO no notifications setting
        if (!this.notifications[sound]) throw new Error("No such sound: " + sound)
        // fuck, new audio object for each notification, really?
        let audio = new Audio(this.notifications[sound])
        audio.play()
    }

    /**
     playable must have methods: play pause
     **/

    play() {
        if (this.active) {
            this.active.play().then(audio => {
            	this.update();
            	UIEvents.General.fire("audio.play", {audio: this.active});
            });
        }
    }

    set(audio) {
        if (this.active === audio) return;
        if (this.active) {
            this.active.pause();
        }
        if(!audio) {
        	UIEvents.General.fire("audio.remove");
        }
        this.active = audio;
        this.update();
        this.hasMeta = !!this.active.getMeta;
        this.updateBrowserMeta();
        //UIEvents.General.fire("audio.set");
    }

    pause() {
        if (this.active) {
            this.active.pause();
            this.update();
            UIEvents.General.fire("audio.pause");
        }
    }

    toggle(pause) {
    	if(pause === undefined) {
    		pause = this.active.isPlaying(); //pause if playing
    	}

    	if(pause) {
    		this.pause()
    	} else {
    		this.play();
    	}
    }

    update() {
    	if(!this.active) {
    		this.setPlaybackState("none");
            return;
    	}
        if (this.active.isPlaying()) {
            this.setPlaybackState("playing");
        } else {
            this.setPlaybackState("paused");
        }
    }

    clear() {
        this.active.pause;
        this.active = null;
    }

    setPlaybackState(state) {
        if (!navigator.mediaSession) return;
        navigator.mediaSession.playbackState = state;
    }

    _bindNavigatorEvents() {
        if (!navigator.mediaSession) return;
        navigator.mediaSession.setActionHandler('play', this.play.bind(this));

        navigator.mediaSession.setActionHandler('pause', this.pause.bind(this));
    }

    updateBrowserMeta() {
        if (!navigator.mediaSession) return;
        this.active.getMeta().then(meta => {
            if (!meta || !meta.artwork) return;
            for (const artwork of meta.artwork) {
                if (!artwork.src) {
                    artwork.src = "./static/images/logo-192x192.png";
                    artwork.sizes = "192x192";
                }
            }
            navigator.mediaSession.metadata = new MediaMetadata(meta);
        }).catch(error => console.log(error))
    }
}

const AudioManager = new AudioManagerSingleton()

export default AudioManager
