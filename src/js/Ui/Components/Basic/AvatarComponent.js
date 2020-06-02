import AppEvents from "../../../Api/EventBus/AppEvents";
import AvatarFragment from "./AvatarFragment"
import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent"

class AvatarComponent extends StatelessComponent {

    appEvents(E) {
        E.bus(AppEvents.Peers)
            .filter(event => event.peer === this.props.peer)
            .updateOn("updatePhoto")
            .updateOn("updatePhotoSmall")
    }

    render() {
        return <AvatarFragment peer={this.props.peer}
                               saved={this.props.saved}
                               onClick={this.props.onClick}/>
    }
}

AvatarComponent.defaultProps = {
    saved: false
};

export default AvatarComponent