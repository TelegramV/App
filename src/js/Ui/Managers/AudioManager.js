/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
        let audio = new Audio(this.notifications[sound])
        audio.play()
    }

    /**
     playable must have methods: play pause
     **/

    play() {
        if (this.active) {
            this.active.play();
            this.setPlaybackState("playing");
        }
    }

    set(audio) {
        if (this.active === audio) return;
        if (this.active) {
            this.active.pause();
        }
        this.active = audio;
        if (!audio) {
            this.setPlaybackState("none");
            return;
        } else {
            this.update();
        }
        this.hasMeta = !!this.active.getMeta;
        this.updateBrowserMeta();
    }

    pause() {
        if (this.active) {
            this.active.pause();
            this.setPlaybackState("paused");
        }
    }

    update() {
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
