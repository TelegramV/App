import UIEvents from "../../../../../EventBus/UIEvents"
import StatefulComponent from "../../../../../../V/VRDOM/component/StatefulComponent"

class SquareComponent extends StatefulComponent {
    /*state = {
        url: undefined
    };*/

    /*appEvents(E) {
        E.bus(UIEvents.General)
            .filter(event => event.id === this.props.wallpaperId)
            .on("wallpaper.previewReady", this.onWallpaperReady);
    }*/

    render() {
        return (
            <div class="image-square"
                 onClick={this.props.click}
                 url={this.props.src}
                 wallpaper={this.props.wallpaper}
                 style={{"background-image": `url(${this.props.src})`}}/>
        );
    }

    /*onWallpaperReady = event => {
        this.setState({
            url: event.wallpaperUrl
        });
    }*/
}

export default SquareComponent;