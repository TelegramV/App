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