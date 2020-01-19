export class MonkeyController {
    constructor() {

        this.states = {
            close: "/static/monkey/TwoFactorSetupMonkeyClose.tgs",
            closeAndPeek: "/static/monkey/TwoFactorSetupMonkeyCloseAndPeek.tgs",
            closeAndPeekToIdle: "/static/monkey/TwoFactorSetupMonkeyCloseAndPeekToIdle.tgs",
            idle: "/static/monkey/TwoFactorSetupMonkeyIdle.tgs",
            peek: "/static/monkey/TwoFactorSetupMonkeyPeek.tgs",
            tracking: "/static/monkey/TwoFactorSetupMonkeyTracking.tgs"
        };

        this.nextState = null;
        this.nextPauseFrame = -1;
        this.nextStartFrame = null;

        this.peeking = false;
        this.closed = false;

        this.trackSym = 0;

        this.frameHandler = this._frameListener.bind(this);

        this.completionHandler = this._completionListener.bind(this);
    }

    init(player) {
        this.monkey = player;
        this.monkey.addEventListener("frame", this.frameHandler);
        this.monkey.addEventListener("complete", this.completionHandler);
    }

    monkeyLook(symbols) {
        console.log(this)
        if (symbols === 0) {
            this.monkey.setSpeed(2);
            this.monkey.play();
            this.smoothIdle(); //take a glorious look at empty code and back to idle
            this.trackSym = 0;
            return
        }
        if (symbols == this.trackSym) return;

        let start = 10;
        let nextFrame = start + symbols * 3;

        if (this.trackSym == 0) {
            if (symbols > 0) { //started typing
                this.track().then(() => {
                    this.monkey.setSpeed(1);
                    this.monkey.play();
                    this.nextPauseFrame = nextFrame;
                })
            }
        } else if (this.trackSym > 0) {
            if (symbols > this.trackSym) { //adding new
                this.nextPauseFrame = nextFrame;
                this.monkey.setSpeed(1);
                this.monkey.play();
            } else { //deleting
                this.nextPauseFrame = nextFrame;
                this.monkey.setSpeed(-1);
                this.monkey.play();
            }
        }

        this.trackSym = symbols;
    }

    idle(start) {
        let that = this;
        this.monkey.load(this.states.idle).then(function() {
            that.monkey.setLooping(true);
            that.monkey.setSpeed(1);
            if (start) {
                that.monkey.seek(start);
            }
            that.monkey.play();
        });
    }

    track(start) {
        let that = this;
        return this.monkey.load(this.states.tracking).then(function() {
            that.monkey.setLooping(true);
            that.monkey.setSpeed(1);
            if (start) {
                that.monkey.seek(start);
            }
            that.monkey.play();
            that.monkey.pause();
        });
    }

    close(start) {
        let that = this;
        this.closed = true;
        this.monkey.load(this.states.close).then(function() {
            that.monkey.setLooping(false);
            that.monkey.setSpeed(1);
            if (start) {
                that.monkey.seek(start);
            }
            that.monkey.play();
            that.nextPauseFrame = 50;
        });
    }

    peek(start) {
        let that = this;
        this.peeking = true;
        if (this.closed) {
            this.monkey.load(this.states.peek).then(function() {
                that.monkey.setLooping(false);
                if (start) {
                    that.monkey.seek(seek);
                }
                that.monkey.play();
                that.nextPauseFrame = 50;
            });
        } else {
            this.monkey.load(this.states.closeAndPeek).then(function() {
                that.monkey.setLooping(false);
                if (start) {
                    that.monkey.seek(seek);
                }
                that.monkey.play();
                that.nextPauseFrame = 95;
            });
        }
    }

    open() {
        let that = this;
        if (this.peeking) {
            this.monkey.load(this.states.closeAndPeekToIdle).then(function() {
                that.monkey.setLooping(false);
                that.monkey.play();
                that.nextState = that.idle;
            });
        } else { //close -> open
            this.monkey.play();
            this.nextState = this.idle;
        }
    }

    smoothTrack() {
        this.nextState = this.track;
        this.monkey.setLooping(false);
        this.monkey.setSpeed(2);
    }

    checkTrack() {
        this.nextState = this.track;
        this.monkey.setLooping(false);
    }

    smoothIdle() {
        this.nextState = this.idle;
        this.monkey.setLooping(false);
        this.monkey.setSpeed(2);
    }

    smoothClose() {
        if (this.peeking) {
            this.nextState = this.close;
            this.nextStartFrame = "49%";
            this.monkey.play();
        } else {
            this.nextState = this.close;
            this.monkey.setLooping(false);
            this.monkey.setSpeed(2);
        }
    }

    checkClose() {
        this.nextState = this.close;
        this.monkey.setLooping(false);
    }

    reset() {
        this.peeking = false;
        this.nextPauseFrame = -1;
        this.nextState = null;
        this.monkey.setLooping(false);
        this.monkey.setSpeed(1);
        this.idle();
    }

    stop() {
        this.monkey.stop();
    }

    _frameListener(event) {
        if (this.nextPauseFrame > -1) {
            if (this.monkey.getLottie().playSpeed > 0 && event.detail.seeker >= this.nextPauseFrame ||
                this.monkey.getLottie().playSpeed < 0 && event.detail.seeker <= this.nextPauseFrame) {
                this.monkey.pause();
                this.nextPauseFrame = -1;
            }
        }
    }

    _completionListener(event) {
        if (this.nextState) {
            if (this.nextState != this.peek) this.peeking = false;
            if (this.nextState != this.close) this.closed = false;
            this.nextState(this.nextStartFrame);
            this.monkey.setSpeed(1);
            this.nextState = null;
            this.nextStartFrame = null;
        }
    }
}