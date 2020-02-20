class AudioManager0 {
    constructor() {
        this.active = null;

        this.notifications = {
            "notification": "/static/notification.mp3",
            "out": "/static/sound_out.mp3",
            "in": "/static/sound_in.mp3",
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

const AudioManager = new AudioManager0();

export default AudioManager;
