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

import MTProto from "../../MTProto/External"

function getLanguages(langPack="tdesktop") {
    return MTProto.invokeMethod("langpack.getLanguages", {
        lang_pack: langPack
    })
}

function getLanguage(langPack="tdesktop", langCode="en") {
    return MTProto.invokeMethod("langpack.getLanguage", {
        lang_pack: langPack,
        lang_code: langCode
    })
}

function getStrings(langPack="tdesktop", langCode="en", keys=[]) {
    return MTProto.invokeMethod("langpack.getStrings", {
        lang_pack: langPack,
        lang_code: langCode,
        keys: keys
    })
}

function getDifference(langPack="tdesktop", langCode="en", fromVersion = 0) {
    return MTProto.invokeMethod("langpack.getDifference", {
        lang_pack: langPack,
        lang_code: langCode,
        from_version: fromVersion
    })
}

function getLangPack(langPack="tdesktop", langCode="en") {
    return MTProto.invokeMethod("langpack.getLangPack", {
        lang_pack: langPack,
        lang_code: langCode,
    })
}

const langpack = {
    getLanguages: getLanguages,
    getLanguage: getLanguage,
    getStrings: getStrings,
    getDifference: getDifference,
    getLangPack: getLangPack
}

export default langpack