import MTProto from "../../MTProto/External";
import keval from "../../Keval/keval";

class Localization0 {

    langCode = "en";

    init() {
        keval.getItem("language").then(data => {
            if(data) {
                this.langCode = data;
            }
        })
    }

    async getEmojiKeywords(langCode) {
        if(!langCode) langCode = this.langCode;
        let keywords = await keval.getItem("emoji_keywords_"+langCode);
        if(keywords) return keywords;
        if(this.fetchingEmojiKeywords) return this.fetchingEmojiKeywords; //don't start download twice

        return this.fetchingEmojiKeywords = MTProto.invokeMethod("messages.getEmojiKeywords", {
            lang_code: langCode
        }).then(diff => {
            let map = {};
            for(let item of diff.keywords) {
                map[item.keyword] = item.emoticons;
            }
            return keval.setItem("emoji_keywords", map).then(value => {
                return map;
            });
        })
    }

    async suggestEmojis(text, langCode) {
        if(text.trim().length === 0) return [];
        let keywords = await this.getEmojiKeywords(langCode);
        let suggested = [];
        for(let key in keywords) {
            if(key.startsWith(text)) suggested.push(...keywords[key]);
        }
        return suggested;
    }
}

const Localization = new Localization0();
export default Localization;
