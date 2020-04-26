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

import VButton from "../../Elements/Button/VButton"
import VComponent from "../../../V/VRDOM/component/VComponent"
import {DocumentMessagesTool} from "../../Utils/document"

class Icon extends VComponent {
    state = {
        isDownloaded: false
    }

    render() {
        return (
            <div className="svg-wrapper" onClick={() => this.setState({isDownloaded: !this.state.isDownloaded})}>
                {DocumentMessagesTool.createIcon("#E93A3A", !this.state.isDownloaded)}
            </div>
        )
    }
}

function ElementsPage() {
    return (
        <div>
            <Icon/>
            <VButton>
                Subscribe
            </VButton>
            <VButton isFlat>
                Subscribe
            </VButton>
            <VButton isRound>
                +
            </VButton>
            <VButton isFlat isRound>
                +
            </VButton>
        </div>
    );
}

export default ElementsPage;