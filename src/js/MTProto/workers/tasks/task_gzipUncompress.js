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

import {GZIP_UNCOMPRESS} from "../../crypto/gzip"

function task_gzipUncompress({data, success, fail}) {
    try {
        const uncompressed = GZIP_UNCOMPRESS(data)
        success(uncompressed)
    } catch (error) {
        fail(error)
    }
}

export default task_gzipUncompress