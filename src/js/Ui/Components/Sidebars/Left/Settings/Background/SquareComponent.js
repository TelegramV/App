import UIEvents from "../../../../../EventBus/UIEvents"
import StatefulComponent from "../../../../../../V/VRDOM/component/StatefulComponent"

class SquareComponent extends StatefulComponent {
    state = {
        url: undefined
    };

    appEvents(E) {
        E.bus(UIEvents.General)
            .filter(event => event.id === this.props.wallpaperId)
            .on("wallpaper.ready", this.onWallpaperReady);
    }

    render() {
        return (
            <div class="image-square"
                 onClick={this.props.click}
                 url={this.state.url}
                 style={{"background-image": `url(${this.state.url})`}}/>
        );
    }

    onWallpaperReady = event => {
        this.setState({
            url: event.wallpaperUrl
        });
    }
}

export default SquareComponent;