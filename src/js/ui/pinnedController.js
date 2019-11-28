let pinned = null;
let audio = null;

export function pin(msg) {
    this.pinned = msg;
}

export function unpin() {
    this.pinned = null;
}

export function pinAudio(audio) {
    this.audio = audio;
}

export function unpinAudio() {
    this.audio = null;
    //stop audio?
}

export function getPinned() {
    return this.pinned;
}

export function hasAudio() {
    return !!this.audio;
}

export function getAudio() {
    return this.audio;
}

export const Pinned = () => {
    if (this.audio) {
        return <div className="pin active-audio">
        			<div className="play tgico tgico-play"></div>
        			<div className="text-wrapper">
                		<div className="title">Pinned message</div>
                		<div className="description">See you tomorrow at 18:00 at the park</div>
                	</div>
                </div>
    }
    if (this.pinned) {
        return <div className="pin pinned-message">
                	<div className="title">Pinned message</div>
                	<div className="description">See you tomorrow at 18:00 at the park</div>
                </div>
    } else {
        <div className="pin pinned-message"/>
    }
}