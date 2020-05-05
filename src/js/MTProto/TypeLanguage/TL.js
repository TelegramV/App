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

import Unpacker from "./Unpacker"
import Packer from "./Packer"

const TL = {
    unpack: (buffer: ArrayBuffer, constructor?: string) => (new Unpacker(buffer)).object(constructor),
    unpacker: (buffer: ArrayBuffer) => new Unpacker(buffer),
    pack: (constructor: Object, type?: string) => {
        const packer = new Packer()
        packer.object(constructor, type)
        return packer
    },
    packer: (options) => new Packer(options)
}

export default TL