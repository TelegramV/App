import MTProto from "../../MTProto/External";
import keval from "../../Keval/keval";

class EmojiLangpack {

    langCode = "en";

    init() {
        // currently using only English

        /*keval.lang.getItem("lang_code").then(data => { 
            if(data) {
                this.langCode = data;
            }
        })*/
    }

    async getEmojiKeywords(langCode) {
        if(!langCode) langCode = this.langCode;
        if(this.keywordsMap) return this.keywordsMap

        let keywords = await keval.lang.getItem("emoji_keywords_"+langCode);
        let version = await keval.lang.getItem("emoji_keywords_version_"+langCode);

        if(keywords) {
            return MTProto.invokeMethod("messages.getEmojiKeywordsDifference", {
                lang_code: langCode,
                version: version ?? 0
            }).then(diff => {
                for(let item of diff.keywords) {
                    keywords[item.keyword] = item.emoticons;
                }
                return this.keywordsMap = this.saveMap(keywords, diff.version);
            })
        }

        if(this.fetchingEmojiKeywords) return this.fetchingEmojiKeywords; //don't start download twice

        return this.fetchingEmojiKeywords = MTProto.invokeMethod("messages.getEmojiKeywords", {
            lang_code: langCode
        }).then(diff => {
            let map = {};
            for(let item of diff.keywords) {
                map[item.keyword] = item.emoticons;
            }
            return this.keywordsMap = this.saveMap(map, diff.version);
        })
    }

    saveMap(map, version) {
        keval.lang.setItem("emoji_keywords_version_"+this.langCode, version);
        return keval.lang.setItem("emoji_keywords_"+this.langCode, map).then(value => {
            return map;
        });
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

export default new EmojiLangpack();
