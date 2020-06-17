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

class DocumentParser {
    static attributeFilename(document) {
        return document?.attributes?.find(attr => attr._ === "documentAttributeFilename")?.file_name;
    }

    static attributeAudio(document) {
        return document?.attributes?.find(attr => attr._ === "documentAttributeAudio");
    }

    static attributeVideo(document) {
        return document?.attributes?.find(attr => attr._ === "documentAttributeVideo");
    }

    static isVideoStreamable(document) {
        const video = DocumentParser.attributeVideo(document);
        return !__IS_IOS__ && video.supports_streaming && document.size >= (1024 * 1024 * 4);
    }
}

export default DocumentParser;