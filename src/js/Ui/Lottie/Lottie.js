// ported from https://github.com/chenqingspring/react-lottie

import StatefulComponent from "../../V/VRDOM/component/StatefulComponent"
import lottie from "../../../../vendor/lottie-web"

// import lottie from "lottie-web"

class Lottie extends StatefulComponent {
    componentDidMount() {
        const {
            options,
            eventListeners,
        } = this.props;

        const {
            loop,
            autoplay,
            animationData,
            rendererSettings,
            segments,
        } = options;

        this.options = {
            container: this.$el,
            renderer: "canvas",
            loop: loop !== false,
            autoplay: autoplay !== false,
            segments: segments !== false,
            animationData,
            rendererSettings,
        };

        // console.log(this.$el)

        this.options = {...this.options, ...options};

        // this.anim = lottie.loadAnimation(this.options);
        // this.anim.setSubframe(false);
        // this.registerEvents(eventListeners);

        // this.withTimeout(_ => {
        this.anim = lottie.loadAnimation(this.options);
        this.anim.setSubframe(false);
        this.registerEvents(eventListeners);
        // }, 0)

        // console.log("mounted??")
    }

    componentWillUpdate(nextProps /* , nextState */) {
        /* Recreate the animation handle if the data is changed */
        // console.log(nextProps)
        if (
            this.options.animationData !== nextProps.options.animationData ||
            this.options.path !== nextProps.options.path
        ) {
            this.deRegisterEvents(this.props.eventListeners);
            this.destroy();
            this.options = {...this.options, ...nextProps.options};
            this.anim = lottie.loadAnimation(this.options);
            this.registerEvents(nextProps.eventListeners);
        }
    }

    componentDidUpdate() {
        if (this.props.isStopped) {
            this.stop();
        } else if (this.props.segments) {
            this.playSegments();
        } else {
            this.play();
        }

        this.pause();
        this.setSpeed();
        this.setDirection();
    }

    componentWillUnmount() {
        this.deRegisterEvents(this.props.eventListeners);
        this.destroy();
        this.options.animationData = null;
        this.options.path = null;
        this.anim = null;
    }

    setSpeed = () => {
        this.anim.setSpeed(this.props.speed);
    }

    setDirection = () => {
        this.anim.setDirection(this.props.direction);
    }

    play = () => {
        this.anim.play();
    }

    playSegments = () => {
        this.anim.playSegments(this.props.segments);
    }

    stop = () => {
        this.anim.stop();
    }

    pause = () => {
        if (this.props.isPaused && !this.anim.isPaused) {
            this.anim.pause();
        } else if (!this.props.isPaused && this.anim.isPaused) {
            this.anim.pause();
        }
    }

    destroy() {
        this.anim.destroy();
    }

    registerEvents = (eventListeners) => {
        this.anim.addEventListener("DOMLoaded", this.onDOMLoaded)

        eventListeners.forEach((eventListener) => {
            this.anim.addEventListener(eventListener.eventName, eventListener.callback);
        });
    }

    deRegisterEvents = (eventListeners) => {
        this.anim.removeEventListener("DOMLoaded", this.onDOMLoaded)

        eventListeners.forEach((eventListener) => {
            this.anim.removeEventListener(eventListener.eventName, eventListener.callback);
        });
    }

    onDOMLoaded = () => {
        // console.warn("LOADED")
        // this.anim.play();
    }

    render() {
        const {
            width,
            height,
            ariaRole,
            ariaLabel,
            onClick,
            title,
        } = this.props;

        const getSize = (initial) => {
            let size;

            if (typeof initial === 'number') {
                size = `${initial}px`;
            } else {
                size = initial || '100%';
            }

            return size;
        };

        const lottieStyles = {
            width: getSize(width),
            height: getSize(height),
            overflow: 'hidden',
            outline: 'none',
            display: 'flex',
            'align-items': 'center',
            ...this.props.style,
        };
        const onClickHandler = onClick ? onClick : () => null;

        return (
            // Bug with eslint rules https://github.com/airbnb/javascript/issues/1374
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div class={this.props.class}
                 style={lottieStyles}
                 onClick={onClickHandler}
                 title={title}
                 role={ariaRole}
                 aria-label={ariaLabel}
                 tabIndex="0"
                 onMouseOver={this.onMouseOver}
                 onMouseOut={this.onMouseOut}
            />
        );
    }

    onMouseOver = e => {
        if (this.props.playOnHover) {
            this.anim.loop = true;
            this.anim.play();
        }
    }

    onMouseOut = e => {
        if (this.props.playOnHover) {
            this.anim.loop = false;
        }
    }
}

Lottie.defaultProps = {
    eventListeners: [],
    isStopped: false,
    isPaused: false,
    speed: 1,
    ariaRole: 'button',
    ariaLabel: 'animation',
    title: '',
};

export default Lottie;