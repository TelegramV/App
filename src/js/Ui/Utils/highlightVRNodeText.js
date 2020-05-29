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

export const highlightVRNodeWord = (text: string, str: string) => {
    if (!str) {
        return text
    }

    const originalText = text

    text = text.toLowerCase()
    str = str.toLowerCase().trim()

    str === "+" && (str = `\\${str}`)

    const position = text.search(str)

    if (position === -1) {
        return originalText
    }

    let before = originalText.substring(0, position)
    if (before.length > 30) {
        before = "..." + before.substring(before.length - 20, before.length)
    }

    const found = originalText.substring(position, position + str.length)

    let after = originalText.substring(position + str.length)
    if (after.length > 30) {
        after = after.substring(0, 30) + "..."
    }

    return <span>{before}<span class="color-blue">{found}</span>{after}</span>
}