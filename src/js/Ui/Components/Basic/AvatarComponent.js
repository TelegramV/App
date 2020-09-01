import AppEvents from "../../../Api/EventBus/AppEvents";
import AvatarFragment from "./AvatarFragment";
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent";

class AvatarComponent extends StatefulComponent {
    state = {
        hover: false
    };

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .filter(event => event.peer === this.props.peer)
            .updateOn("updatePhoto")
            .updateOn("updatePhotoSmall")
            .updateOn("updateProfileVideo");
    }

    /* peer can be null */
    render({peer, noSaved, alwaysPlay}, {hover}) {
        return AvatarFragment({
            peer,
            noSaved,
            showVideo: hover,
            alwaysPlay,
            onMouseEnter: () => {
                this.props.peer?.photo?.fetchVideo(); //start fetching only on hover
                this.setState({hover: true});
            },
            onMouseLeave: () => this.setState({hover: false}),
        });
    }

    componentDidMount() {
        if (this.props.alwaysPlay) {
            this.props.peer?.photo?.fetchVideo(); //preload if autoplay
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.alwaysPlay) {
            nextProps.peer?.photo?.fetchVideo(); //preload if autoplay
        }
    }
}

AvatarComponent.defaultProps = {
    noSaved: false
};

export default AvatarComponent;