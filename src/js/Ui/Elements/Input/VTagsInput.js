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