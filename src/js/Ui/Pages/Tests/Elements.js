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

import {DocumentMessagesTool} from "../../Utils/document"
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent"

class Icon extends StatefulComponent {
    state = {
        isDownloaded: true
    }

    render() {
        return (
            <div className="svg-wrapper" onClick={() => this.setState({isDownloaded: !this.state.isDownloaded})}>
                {DocumentMessagesTool.createIcon("#E93A3A", !this.state.isDownloaded)}
            </div>
        )
    }

    componentDidMount() {
        // this.withInterval(() => {
        //     this.setState({
        //         isDownloaded: !this.state.isDownloaded
        //     })
        // }, 100)
    }
}

function ElementsPage() {
    return (
        <div>
            <Icon/>
            {/*<VButton>*/}
            {/*    Subscribe*/}
            {/*</VButton>*/}
            {/*<br/>*/}
            {/*<VButton isFlat>*/}
            {/*    Subscribe*/}
            {/*</VButton>*/}
            {/*<br/>*/}
            {/*<VButton isRound>*/}
            {/*    +*/}
            {/*</VButton>*/}
            {/*<br/>*/}
            {/*<VButton isFlat isRound>*/}
            {/*    +*/}
            {/*</VButton>*/}
            {/*<br/>*/}
            {/*<VInput label="Search" onInput={event => console.log(event.target.value)}/>*/}
            {/*<VLazyInput label="Lazy" onInput={event => console.log(event.target.value)} lazyLevel={300}/>*/}
        </div>
    );
}

export default ElementsPage;