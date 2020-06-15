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

import AppEvents from "../../../Api/EventBus/AppEvents"
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"
import FileManager from "../../../Api/Files/FileManager"

class BasicVideoComponent extends StatefulComponent {
    state = {
        url: "",
    };

    appEvents(E) {
        E.bus(AppEvents.Files)
            .filter(event => event.file.id === this.props.document.id)
            .on("download.done", this.onDownloadDone)
            .on("download.newPart", this.onDownloadNewPart);
    }

    render({document, ...otherArgs}, {url}) {
        return (
            <video src={url} {...otherArgs}/>
        );
    }

    componentWillMount({document}) {
        if (FileManager.isDownloaded(document)) {
            this.state.url = FileManager.getUrl(document);
        } else {
            FileManager.downloadDocument(document);
        }
    }

    onDownloadDone = ({url}) => {
        this.setState({
            url,
        });
    }
}


// componentDidMount() {
//     FileManager.downloadDocument(this.props.document);
// }
//
// componentWillUpdate(nextProps, nextState) {
//     if (nextProps.document.id !== this.props.document.id) {
//         FileManager.downloadDocument(this.props.document);
//     }
// }
//
// shouldComponentUpdate(nextProps, nextState) {
//     if (nextProps.document.id !== this.props.document.id) {
//         return true;
//     }
// }

export default BasicVideoComponent;