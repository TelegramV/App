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
        success: false,
        error: false,
    };

    appEvents(E: AE) {
        E.bus(UIEvents.General)
            .on("snackbar.show", this.show)
            .on("snackbar.close", this.close);
    }

    render() {
        const {text, isShown, success, error} = this.state;

        return (
            <div id="snackbar" className={{
                "show": isShown,
                "success": success,
                "error": error,
            }}>
                <span>{text}</span>
            </div>
        );
    }

    show = event => {
        this.clearTimeouts();

        this.setState({
            text: event.text,
            isShown: true,
            success: event.success,
            error: event.error,
        });

        if (event.time) {
            this.withTimeout(this.close, event.time * 1000);
        }
    }

    close = () => {
        this.clearTimeouts();

        this.setState({
            text: null,
            isShown: false,
            success: false,
            error: false,
        });
    }
}

export default SnackbarComponent;