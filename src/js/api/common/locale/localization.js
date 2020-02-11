import { MTProto } from "../../../mtproto/external";
import AppCache from "../../cache"

const PACK_NAME = "tdesktop";
const FILE_SECTION = "languages";

class LocaleController0 {
    constructor(currentLanguageCode = "en") {
        this.currentLanguageCode = currentLanguageCode;
        this.currentLanguage = undefined;
    }

    init() {
        this.currentLanguage = this.retrieveLanguage(this.currentLanguageCode);
    }

    getLanguages() {
        MTProto.invokeMethod("langpack.getLanguages", { lang_pack: PACK_NAME }).then(l => {
            //TODO cache this list, use for panel
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
        this.parser = new LanguageParser(blob);
    }

    retrieveLanguage(code) {
        let that = this;
        //TODO save meta (version, name...)
        AppCache.get(FILE_SECTION, PACK_NAME + "_" + code).then(blob => that.currentLanguage = blob, that.setLanguage(code));
    }

    getLanguageParser() {
        return this.parser;
    }
}

export class LanguageParser {
    constructor(blob) {
        let that = this;
        this.strings = {}
        let obj = new Response(blob).json().then(json => {
            for (const iter of json) {
                that.strings[iter.key] = iter.value;
            }
        });

    }

    get(key, replace = {}) {
    	let str = this.strings[key] || key;
    	for(let val in replace) {
            if(val ===null || val ===undefined) continue;
    		str = str.replace("{"+val+"}", replace[val]);
    	}
    	return str;
    }
}

export const LocaleController = new LocaleController0("en");
let L;
export default L = (key, replace={})=>{
    return LocaleController.getLanguageParser().get(key,replace)
};
