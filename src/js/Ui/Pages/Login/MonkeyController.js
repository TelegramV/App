import MTProto from "../../../MTProto/External"
import lottie from "../../../../../vendor/lottie-web"

function convertToByteArray(bytes) {
    if (Array.isArray(bytes)) {
        return bytes
    }

    bytes = new Uint8Array(bytes)

    const newBytes = []

    for (let i = 0, len = bytes.length; i < len; i++) {
        newBytes.push(bytes[i])
    }

    return newBytes
}

export class MonkeyController {
    constructor() {

        this.states = {
            close: "./static/monkey/TwoFactorSetupMonkeyClose.tgs",
            closeAndPeek: "./static/monkey/TwoFactorSetupMonkeyCloseAndPeek.tgs",
            closeAndPeekToIdle: "./static/monkey/TwoFactorSetupMonkeyCloseAndPeekToIdle.tgs",
            idle: "./static/monkey/TwoFactorSetupMonkeyIdle.tgs",
            peek: "./static/monkey/TwoFactorSetupMonkeyPeek.tgs",
            tracking: "./static/monkey/TwoFactorSetupMonkeyTracking.tgs"
        };

        this.nextState = null;
        this.nextPauseFrame = -1;
        this.nextStartFrame = null;

        this.peeking = false;
        this.closed = false;

        this.trackSym = 0;
    }

    init(player) {
        this.$monkey = player
        this.load(this.states.idle)
    }

    monkeyLook(symbols) {
        if (symbols === 0) {
            this.animation.setSpeed(-1);
            this.animation.play();
            this.smoothIdle();
            this.trackSym = 0;
            return
        }
        if (symbols == this.trackSym) return;

        let start = 18;
        let nextFrame = start + symbols * 3;

        if (this.trackSym == 0) {
            if (symbols > 0) { //started typing
                this.track().then(() => {
                    this.animation.setSpeed(1);
                    this.animation.play();
                    this.nextPauseFrame = nextFrame;
                })
            }
        } else if (this.trackSym > 0) {
            if (symbols > this.trackSym) { //adding new
                this.nextPauseFrame = nextFrame;
                this.animation.setSpeed(1);
                this.animation.play();
            } else { //deleting
                this.nextPauseFrame = nextFrame;
                this.animation.setSpeed(-1);
                this.animation.play();
            }
        }

        this.trackSym = symbols;
    }

    load(path, loop = true) {
        if (this.animation) {
            this.animation.loop = false;
        }

        return fetch(path).then(l => {
            return l.arrayBuffer().then(async q => {
                return await MTProto.performWorkerTask("gzipUncompress", convertToByteArray(q))
            })
        }).then(l => {
            if (this.animation) {
                this.animation.destroy()
            }
            this.animation = lottie.loadAnimation({
                container: this.$monkey, // the dom element that will contain the animation
                renderer: 'canvas',
                loop: loop,
                autoplay: true,
                name: path,
                animationData: JSON.parse(new TextDecoder("utf-8").decode(l)) // the path to the animation json
            })

            // this.animation.play()
            this.animation.addEventListener("loopComplete", this._completionListener.bind(this));
            this.animation.addEventListener("enterFrame", this._frameListener.bind(this));
        })
    }

    idle(start) {
        let that = this;
        this.load(this.states.idle).then(function () {
            that.animation.setSpeed(1);
            if (start) {
                that.animation.seek(start);
            }
            that.animation.play();
        });
    }

    track(start) {
        let that = this;
        return this.load(this.states.tracking).then(function () {
            that.animation.setSpeed(1);
            if (start) {
                that.animation.seek(start);
            }
            that.animation.play();
            that.animation.pause();
        });
    }

    close(start) {
        let that = this;
        this.closed = true;
        this.load(this.states.close).then(function () {
            that.animation.setSpeed(1);
            if (start) {
                that.animation.seek(start);
            }
            that.animation.play();
            that.nextPauseFrame = 50;
        });
    }

    peek(start) {
        let that = this;
        this.peeking = !this.peeking;
        if (this.closed) {
            this.load(this.states.peek, false).then(function () {
                if (start) {
                    that.animation.seek(seek);
                }
                if (that.peeking) {
                    that.animation.playSegments([0, 20], true)
                } else {
                    that.animation.playSegments([20, 33], true)
                }
                that.nextPauseFrame = 50;
            });
        } else {
            this.load(this.states.closeAndPeek, false).then(function () {
                if (start) {
                    that.animation.seek(seek);
                }
                that.animation.play();
                that.nextPauseFrame = 95;
            });
        }
    }

    open() {
        console.log("open")
        let that = this;
        if (this.peeking) {
            this.load(this.states.closeAndPeekToIdle).then(function () {
                that.animation.play();
                that.nextState = that.idle;
            });
        } else { //close -> open
            this.animation.play();
            this.nextState = this.idle;
        }
    }

    smoothTrack() {
        this.nextState = this.track;
        this.animation.setSpeed(2);
    }

    checkTrack() {
        this.nextState = this.track;
    }

    smoothIdle() {
        this.nextState = this.idle;
        this.animation.setSpeed(2);
    }

    smoothClose() {
        if (this.peeking) {
            this.nextState = this.close;
            this.nextStartFrame = "49%";
            this.animation.play();
        } else {
            this.nextState = this.close;
            this.animation.setSpeed(2);
        }
    }

    checkClose() {
        this.nextState = this.close;
    }

    reset() {
        this.peeking = false;
        this.nextPauseFrame = -1;
        this.nextState = null;
        if (this.animation) this.animation.setSpeed(1);
        this.idle();
    }

    stop() {
        if (this.animation)
            this.animation.stop();
    }

    _frameListener(event) {
        if (this.nextPauseFrame > -1) {
            if (this.animation.playSpeed > 0 && event.currentTime >= this.nextPauseFrame ||
                this.animation.playSpeed < 0 && event.currentTime <= this.nextPauseFrame) {
                this.animation.pause();
                this.nextPauseFrame = -1;
            }
        }
    }

    _completionListener(event) {
        if (this.nextState) {
            if (this.nextState != this.peek) this.peeking = false;
            if (this.nextState != this.close) this.closed = false;
            this.nextState(this.nextStartFrame);
            this.animation.setSpeed(1);
            this.nextState = null;
            this.nextStartFrame = null;
        }
    }
}