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

import __component_withDefaultProps from "./__component_withDefaultProps"

class StatelessComponent {
    static defaultProps;

    props = {};
    identifier = null;

    constructor(config) {
        this.props = __component_withDefaultProps(this, config.props);
        this.identifier = config.identifier;
    }

    render(props) {
        //
    }
}

class Clock extends StatelessComponent {
    render(props) {
        return <h1>{new Date().toLocaleDateString()}</h1>
    }
}

export default StatelessComponent;