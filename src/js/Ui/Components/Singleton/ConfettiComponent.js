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
import ConfettiCanvasComponent from "../Basic/ConfettiCanvasComponent"

class ConfettiComponent extends StatefulComponent {
    state = {
        confetti: new Map(),
    };

    appEvents(E: AE) {
        E.bus(UIEvents.General)
            .on("confetti.show", this.show)
            .on("confetti.remove", this.removeAll);
    }

    render() {
        return (
            <div className="confetti-container">
                {Array.from(this.state.confetti.values())}
            </div>
        );
    }

    show = event => {
        this.state.confetti.set(Date.now(), <ConfettiCanvasComponent/>)
        this.forceUpdate();
        this.withTimeout(this.removeOld, 11000);
    }

    removeOld = () => {
        let now = Date.now();
        for (let k of this.state.confetti.keys()) {
          if (now - k > 10000) this.state.confetti.delete(k);
        }
        this.forceUpdate();
    }

    removeAll = () => {
        this.state.confetti.clear();
        this.forceUpdate();
    }
}

export default ConfettiComponent;