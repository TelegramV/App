const sounds = {
    "notification": "/static/notification.mp3",
    "out": "/static/sound_out.mp3",
    "in": "/static/sound_in.mp3",
}

let activeAudio = [];

export function playSound(sound) {
    if (!sounds[sound]) throw new Error("No such sound: " + sound)
    let audio = new Audio(sounds[sound]);
    audio.play();
}

export function playAudio(audio) {
    if (!audio) throw new Error("No audio provided!");
    audioRegistry.push(audio);
    audio.play();
}

export function clear() {
	activeAudio.forEach(e=>e.stop());
	activeAudio.clear();
}