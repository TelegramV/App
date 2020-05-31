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

import UIEvents from "../../EventBus/UIEvents";
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"

class SnackbarComponent extends StatefulComponent {
    state = {
        snackbars: new Map(),
        hidden: true,
    };

    appEvents(E: AE) {
        E.bus(UIEvents.General)
            .on("snackbar.show", this.show)
            .on("snackbar.close", this.close);
    }

    render() {
        const {snackbars} = this.state;

        return (
            <div css-display={this.state.hidden && "none"} className="snackbar-container">
                {Array.from(snackbars.values()).map(snackbar => (
                    <div className={{
                        "snackbar": true,
                        "show": true,
                        "success": snackbar.success,
                        "error": snackbar.error,
                    }}>
                        <span>{snackbar.text}</span>
                    </div>
                ))}
            </div>
        );
    }

    show = event => {
        let timeout; // pizda kostyl'
        timeout = this.withTimeout(() => {
            this.clearTimeout(timeout);
            this.state.snackbars.delete(timeout);
            this.forceUpdate();
        }, event.time * 1000);
        this.state.snackbars.set(timeout, {
            text: event.text,
            success: event.success,
            fail: event.fail,
        });
        this.forceUpdate();
    }

    close = () => {
        this.clearTimeouts();
        this.state.snackbars.clear();
        this.forceUpdate();
    }
}

export default SnackbarComponent;