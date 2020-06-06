/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent"
import AppEvents from "../../../Api/EventBus/AppEvents"
import FileManager from "../../../Api/Files/FileManager"

class BackgroundImageThumbComponent extends StatelessComponent {
    appEvents(E) {
        E.bus(AppEvents.Files)
            .filter(event => event.file.id === this.props.photo.id && this.url !== FileManager.getUrl(this.props.photo, this.props.size))
            .updateOn("download.done");
    }

    render({photo, size, tag = "div", ...otherArgs}) {
        this.url = FileManager.getUrl(photo, size);

        return (
            <tag css-background-image={this.url} {...otherArgs}/>
        )
    }

    componentDidMount() {
        FileManager.downloadPhoto(this.props.photo, this.props.size);
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.photo.id !== this.props.photo.id) {
            FileManager.downloadPhoto(this.props.photo, this.props.size);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.photo.id !== this.props.photo.id) {
            return true;
        }
    }
}

export default BackgroundImageThumbComponent