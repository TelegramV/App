let pinned = null;
let audio = null;

export function pin(msg) {
    pinned = msg;
}

export function unpin() {
    pinned = null;
}

export function pinAudio(a) {
    audio = a;
}

export function unpinAudio() {
    audio = null;
    //stop audio?
}

export function getPinned() {
    return pinned;
}

export function hasAudio() {
    return !!audio;
}

export function getAudio() {
    return audio;
}

export const Pinned = () => {
    if (audio) {
        return <div className="pin active-audio">
        			<div className="play tgico tgico-play"/>
        			<div className="text-wrapper">
                		<div className="title">Pinned message</div>
                		<div className="description">See you tomorrow at 18:00 at the park</div>
                	</div>
                </div>
    }
    if (pinned) {
        return <div className="pin pinned-message">
                	<div className="title">Pinned message</div>
                	<div className="description">See you tomorrow at 18:00 at the park</div>
                </div>
    } else {
        return <div className="pin pinned-message"/>
    }
}