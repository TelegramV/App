const sounds = {
    "notification": "/static/notification.mp3",
    "out": "/static/sound_out.mp3",
    "in": "/static/sound_in.mp3",
}

class AudioManager0 {
    constructor() {
        this.active = null;

        this.notifications = {
            "notification": "/static/notification.mp3",
            "out": "/static/sound_out.mp3",
            "in": "/static/sound_in.mp3",
        }
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

    play(playable) {
        playable.play();
        this.set(playable);
    }

    set(audio) {
        if(this.active) {
            this.active.pause();
        }
        this.active = audio;
    }

    pause() {
        this.active.pause();
    }

    clear() {
        this.active.pause;
        this.active = null;
    }
}

const AudioManager = new AudioManager0();

export default AudioManager;
