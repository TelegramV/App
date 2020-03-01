import VComponent from "../../../V/VRDOM/component/VComponent";
import AppEvents from "../../../Api/EventBus/AppEvents";
import AvatarFragment from "./AvatarFragment"

class AvatarComponent extends VComponent {

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .only(event => event.peer === this.props.peer)
            .on("updatePhoto")
            .on("updatePhotoSmall")
    }

    render() {
        return <AvatarFragment peer={this.props.peer}
                               saved={this.props.saved}/>
    }
}

AvatarComponent.defaultProps = {
    saved: false
}

export default AvatarComponent