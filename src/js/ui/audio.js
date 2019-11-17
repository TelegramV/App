const audios = {
    "notification": "/static/notification.mp3",
    "out": "/static/sound_out.mp3",
    "in": "/static/sound_in.mp3",
}

export function playSound(sound) {
    if(!audios[sound]) throw new Error("No such sound: " + sound)
    new Audio(audios[sound]).play()
}