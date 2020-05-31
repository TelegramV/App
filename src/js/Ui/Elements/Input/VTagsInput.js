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

import AvatarComponent from "../../Components/Basic/AvatarComponent";

function VTagsInput(
    {tags = [], onInput}
) {
    return (
        <div className="VTagsInput" style={{
            "margin-left": "15px"
        }}>
            <div className="tags">
                {tags}
                <div className="input">
                    <input type="text" placeholder="Select chat" onInput={onInput}/>
                </div>
            </div>
        </div>
    );
}

export function VTag(
    {peer, onRemove}
) {
    return <span className="tag" onClick={onRemove}>
            <i className="tgico-close close"/>
             <AvatarComponent peer={peer} onClick={null}/>
             <span>{peer.name}</span>
            </span>
}


export function VTagIcon(
    {icon, onRemove, text}
) {
    return <span className="tag" onClick={onRemove}>
            <i className="tgico-close close"/>
            <i className={["tgico-" + icon, "icon"]}/>
             <span>{text}</span>
            </span>
}


export default VTagsInput