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
import FileManager from "../../../Api/Files/FileManager"
import VideoPlayer from "./VideoPlayer"

class StreamingVideoComponent extends VideoPlayer {
    state = {
        url: "",
    }

    appEvents(E) {
        E.bus(AppEvents.Files)
            .filter(event => FileManager.checkEvent(event, this.props.document))
            .on("download.start", this.onDownloadStart)
            .on("download.done", this.onDownloadDone);
    }

    render(props, state, globalState) {
        props = {...props};
        delete props.document;
        props.src = state.url;

        return super.render(props, state, globalState);
    }

    componentWillMount(props) {
        if (FileManager.isPending(this.props.document)) {
            this.state.url = FileManager.getPending(this.props.document)?.__mp4file.url;
        } else {
            FileManager.downloadVideo(this.props.document);
        }
    }

    onDownloadStart = ({file}) => {
        console.log("on download start")
        this.setState({
            url: file.__mp4file.url,
        });
    }

    onDownloadDone = ({url}) => {
        if (this.state.url === "") {
            this.setState({
                url,
            });
        }
    }
}

export default StreamingVideoComponent;