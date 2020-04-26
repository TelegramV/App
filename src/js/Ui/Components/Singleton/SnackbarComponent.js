/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import VComponent from "../../../V/VRDOM/component/VComponent";
import UIEvents from "../../EventBus/UIEvents";

class SnackbarComponent extends VComponent {
    state = {
        text: null,
        isShown: false,
    };

    appEvents(E: AE) {
        E.bus(UIEvents.General)
            .on("snackbar.show", this.onSnackbarShow)
            .on("snackbar.close", this.onSnackbarClose);
    }

    render() {
        const {text, isShown} = this.state;

        return (
            <div id="snackbar" className={{
                "show": isShown,
            }}>
                <span>{text}</span>
            </div>
        );
    }

    onSnackbarShow = event => {
        this.setState({
            text: event.text,
            isShown: true,
        });
    }

    onSnackbarClose = event => {
        this.setState({
            text: null,
            isShown: false,
        });
    }
}

export default SnackbarComponent;