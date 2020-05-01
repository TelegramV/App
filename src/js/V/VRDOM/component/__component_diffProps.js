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

import __diffObjects from "./__diffObjects";
import __component_withDefaultProps from "./__component_withDefaultProps";
import VComponent from "./VComponent";

const comparator = (prev, next) => typeof prev === "object" || prev !== next;

const __component_diffProps = (component: VComponent, nextProps) => {
    nextProps = __component_withDefaultProps(component, nextProps);
    return __diffObjects(component.props, nextProps, comparator);
}

export default __component_diffProps