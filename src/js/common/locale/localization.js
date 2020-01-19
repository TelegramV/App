import { MTProto } from "../../mtproto";
import AppCache from "../../api/cache"

const PACK_NAME = "tdesktop";
const FILE_SECTION = "languages";

export class LocaleController {
    constructor(currentLanguageCode = "en") {
        this.currentLanguage = this.retrieveLanguage(currentLanguageCode);
    }
    getLanguages() {
        MTProto.invokeMethod("langpack.getLanguages", { lang_pack: PACK_NAME }).then(l => {
            console.log(l)
        })
    }

    setLanguage(code) {
        let that = this;
        MTProto.invokeMethod("langpack.getDifference", { lang_pack: PACK_NAME, lang_code: code, from_version: 0 }).then(diff => {
            that.saveStrings(code, diff.strings);
        })
    }

    saveStrings(code, strings) {
        let text = JSON.stringify(strings);
        let key = PACK_NAME + "_" + code;
        let blob = new Blob([text], { type: "text/plain" });
        AppCache.put(FILE_SECTION, key, blob);
        this.currentLanguage = blob;
        this.languageParser = new LanguageParser(blob);
    }

    retrieveLanguage(code) {
        let that = this;
        AppCache.get(FILE_SECTION, PACK_NAME + "_" + code).then(blob => that.currentLanguage = blob, that.setLanguage(code));
    }

    getLanguageParser() {
        return this.languageParser;
    }
}

export class LanguageParser {
    constructor(blob) {
        let that = this;
        this.strings = {}
        let obj = new Response(blob).json().then(json => {
            for (let i = 0; i < json.length; i++) {
                that.strings[json[i].key] = json[i].value;
            }
        });

    }

    get(key) {
        return this.strings[key] || key;
    }

    get(key, replace) {
    	let str = this.get(key);
    	for(let val in replace) {
    		str = str.replace("{"+val+"}", replace.val);
    	}
    	return str;
    }
}