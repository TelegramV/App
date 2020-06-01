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

import AppEvents from "../EventBus/AppEvents"

class AudioManager {
    current: { document: Object; }

    constructor() {
        AppEvents.Files.subscribe("download.start", event => {

        });

        AppEvents.Files.subscribe("download.newPart", event => {

        });

        AppEvents.Files.subscribe("download.done", event => {

        });

        AppEvents.Files.subscribe("download.canceled", event => {

        });
    }

    play(document) {
        const ctx = new AudioContext()
        const ms = new MediaSource();
        const buff = ms.addSourceBuffer(document.mime_type);
        buff.appendBuffer()
    }

    stop() {

    }

    pause() {

    }

    resume() {

    }
}

export default new AudioManager();