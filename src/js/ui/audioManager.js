import VoiceMessageComponent from "./pages/main/components/chat/message/VoiceMessageComponent"

class AudioManager0 {
    constructor() {
        this.active = null;

        this.notifications = {
            "notification": "/static/notification.mp3",
            "out": "/static/sound_out.mp3",
            "in": "/static/sound_in.mp3",
        }

        navigator.mediaSession.setActionHandler('play', this.play.bind(this));

        navigator.mediaSession.setActionHandler('pause', this.pause.bind(this));
    }

    playNotification(sound) {
        //TODO no notifications setting
        if (!this.sounds[sound]) throw new Error("No such sound: " + sound)
        let audio = new Audio(sounds[sound]);
        audio.play();
    }

    /**
        playable must have methods: play pause
    **/

    play() {
        if(this.active) {
            this.active.play();
            navigator.mediaSession.playbackState = "playing";
        }
    }

    set(audio) {
        if(this.active === audio) return;
        if(this.active) {
            this.active.pause();
        }
        this.active = audio;
        if(!audio) {
            navigator.mediaSession.playbackState = "none";
            return;
        } else {
            this.update();
        }
        this.hasMeta = !!this.active.getMeta;
        this.updateBrowserMeta();
    }

    pause() {
        if(this.active) {
            this.active.pause();
            navigator.mediaSession.playbackState = "paused";
        }
    }

    update() {
        if(this.active.isPlaying()) {
            navigator.mediaSession.playbackState = "playing";
        } else {
            navigator.mediaSession.playbackState = "paused";
        }
    }

    clear() {
        this.active.pause;
        this.active = null;
    }

    updateBrowserMeta() {
        if(!navigator.mediaSession) return;
        this.active.getMeta().then(meta => {
            if(!meta || !meta.artwork) return;
            for(const artwork of meta.artwork) {
                if(!artwork.src) artwork.src = "./static/images/logo-192x192.png";
            }
            navigator.mediaSession.metadata = new MediaMetadata(meta);
        }).catch(error => console.log(error))
    }
}

const AudioManager = new AudioManager0();

export default AudioManager;
