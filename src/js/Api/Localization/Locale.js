import MTProto from "../../MTProto/External";
import API from "../Telegram/API"
import keval from "../../Keval/keval";
import UIEvents from "../../Ui/EventBus/UIEvents"
import VRNode from "../../V/VRDOM/VRNode"
import VRDOM from "../../V/VRDOM/VRDOM"
import {getNewlines} from "../../Utils/htmlHelpers"
import * as makePlural from "make-plural"

class Locale {

	langPack = "tdesktop"
	langCode = "en"
	pluralCode = "en"
	langInfo = null;

	/*
		contains key: value
		value:
			normal string: corresponding text
			plural: object with plural forms
			deleted: undefined
	*/
	strings = null;

	// fallback strings
	englishStrings = null;

	async init() {
		await keval.lang.getItem("current_language").then(data => {
			if(!data) {
				return this.downloadLanguage();
			} else {
				this.langInfo = data;
				this.langCode = data.lang_code;
				this.pluralCode = data.plural_code;
			}
		})
		await keval.lang.getItem("strings_"+this.langCode).then(data => {
			if(data) {
				return this.strings = data;
			} else {
				return this.downloadLanguage();
			}
		})

		await keval.lang.getItem("strings_en").then(data => {
			if(data) {
				return this.englishStrings = data;
			} else {
				return this.downloadLanguage("en");
			}
		})

		await this.checkUpdates();
		await this.checkUpdates("en");
		UIEvents.General.fire("language.ready");
	}

	/**
		Method for non-plural strings
		@returns Array of String or VRNode, if any VRNode passed as replacement
	*/
	l(key, replaces) {
		return this.lp(key, 1, replaces); //return string for one, if plural key passed
	}

	/**
		Method for plural strings
		@returns Array of String or VRNode, if any VRNode passed as replacement
	*/
	lp(key="NO_TRANSLATION_KEY_PROVIDED", count=1, replaces = {}) {
		if(key.key) return this.lp(key.key, key.count, key.replaces); //if object passed

		let value = this.strings?.get(key);
		if(!value) value = this.englishStrings?.get(key);
		if(!value) return key;

		let found = key;
		if(!value._plural) {
			found = value;
		} else {
			found = value[this.countToPluralCode(count)] || value.other; 
		}

		for(let replace in replaces) {
			//replacement could be: String, Replacement, VRNode
			let replacement = replaces[replace];
			if(replacement.key) replacement = this.lp(replacement.key, replacement.count, replacement.replaces); //allow recursive replaces
			found = this._replace(found, replace, replacement);
		}

		found = this._replaceNewlines(found);

		if(!Array.isArray(found)) {
			found = [found] //wrap in Array, for return consistency 
		}

		return found.flat();
	}

	_replaceNewlines(where) {
		if(!Array.isArray(where)) where = [where];

		let replaced = [];

		for(let part of where) {
			if(typeof part !== "string" || !part.includes("\n")) {
				replaced.push(part);
				continue;
			}
			replaced.push(getNewlines(part));
		}
		return replaced.flat(Infinity);
	}

	_replace(where, what, to) {
		if(!Array.isArray(where)) where = [where];
		if(!Array.isArray(to)) to = [to];
		const rwhat = `{${what}}`;

		let replaced = [];

		for(let part of where) {
			if(typeof part !== "string") {
				replaced.push(part);
				continue;
			}

			for(let replacement of to) {
				if(replacement instanceof VRNode) {
					const position = part.indexOf(rwhat);
					if(position === -1) continue;
					let split = [];
					split[0] = part.substring(0, position);
					split[1] = to;
					split[2] = part.substring(position + rwhat.length);
					part = split;
				} else {
					part = part.replace(rwhat, replacement)
				}
			}
			replaced.push(part);
		}
		return replaced.flat();
	}

	get currentLanguageCode() {
		return this.langCode
	}

	get currentLanguagePack() {
		return this.langPack
	}

	get currentLanguageInfo() {
		return this.langInfo
	}

	getLanguages() {
		return API.lang.getLanguages();
	}

	getLanguageInfo(code) {
		return API.lang.getLanguage(this.langPack, code);
	}

	async setLanguage(langCode) {
		this.langCode = langCode;
		await this.downloadLanguage();
		UIEvents.General.fire("language.changed", {code: this.langCode});
	}

	downloadLanguage(optionalCode) {
		let code = optionalCode ? optionalCode : this.langCode
		API.lang.getLanguage(this.langPack, code).then(language => {
			keval.lang.setItem("current_language", language);
		})
		return API.lang.getLangPack(this.langPack, code).catch(error => {
			code = "en";
			this.langCode = "en"; //reset values
			this.pluralCode = "en";
			this.langPack = "tdesktop";
			return API.lang.getLangPack(this.langPack, code)
		}).then(diff => {
			let strings = new Map();
			for(let item of diff.strings) {
				let wrapped = this.wrapString(item);
				strings.set(wrapped.key, wrapped.value);
			}
			return this.saveMap(strings, diff.version)
		})
	}

	async checkUpdates(optionalCode) {
		let code = optionalCode ? optionalCode : this.langCode
		let savedVersion = await keval.lang.getItem("strings_version_"+code);
		let diff = await API.lang.getDifference(this.langPack, code, savedVersion);
		if(savedVersion === diff.version) return this.strings;
		//change updated strings
		for(let item of diff.strings) {
			let wrapped = this.wrapString(item);
			this.strings.set(wrapped.key, wrapped.value);
		}
		return this.saveMap(this.strings, diff.version)
	}

	saveMap(map, version) {
		this.strings = map;
        keval.lang.setItem("strings_version_"+this.langCode, version);
        return keval.lang.setItem("strings_"+this.langCode, map).then(value => {
            return map;
        });
    }

    wrapString(string) {
    	let value = string.value ? string.value : {
    		_plural: true,
			zero: string.zero_value,
			one: string.one_value,
			two: string.two_value,
			few: string.few_value,
			many: string.many_value,
			other: string.other_value
		}
		return {key: string.key, value}
    }

    countToPluralCode(count) {
    	return makePlural[this.pluralCode](count);
    }

}

export default new Locale()