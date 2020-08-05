import MTProto from "../../MTProto/External";
import API from "../Telegram/API"
import keval from "../../Keval/keval";
import UIEvents from "../../Ui/EventBus/UIEvents"
import VRNode from "../../V/VRDOM/VRNode"
import VRDOM from "../../V/VRDOM/VRDOM"
import * as makePlural from "make-plural"

class Locale {

	langPack = "tdesktop"
	langCode = "en"
	/*
		contains key: value
		value:
			normal string: corresponding text
			plural: object with plural forms
			deleted: undefined
	*/
	strings = null;

	async init() {
		await keval.lang.getItem("lang_code").then(data => {
			if(!data) {
				return keval.lang.setItem("lang_code", this.langCode);
			} else {
				return this.langCode = data;
			}
		})
		await keval.lang.getItem("strings_"+this.langCode).then(data => {
			if(data) {
				return this.strings = data;
			} else {
				return this.downloadLanguage();
			}
		})

		await this.checkUpdates();
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

		if(!Array.isArray(found)) {
			found = [found] //wrap in Array, for return consistency 
		}

		return found;
	}

	_replace(where, what, to) {
		if(!Array.isArray(where)) where = [where];
		if(!Array.isArray(to)) to = [to];

		let replaced = [];

		for(let part of where) {
			if(typeof part !== "string") {
				replaced.push(part);
				continue;
			}

			for(let replacement of to) {
				if(replacement instanceof VRNode) {
					const position = part.indexOf(`{${what}}`);
					if(position === -1) continue;
					let split = [];
					split[0] = part.substring(0, position);
					split[1] = to;
					split[2] = part.substring(position + `{${what}}`.length);
					part = split;
				} else {
					part = part.replace(`{${what}}`, replacement)
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

	getLanguages() {
		return API.lang.getLanguages();
	}

	async setLanguage(langCode) {
		this.langCode = langCode;
		await this.downloadLanguage();
		UIEvents.General.fire("language.changed", {code: this.langCode});
	}

	downloadLanguage() {
		API.lang.getLanguage(this.langPack, this.langCode).then(language => {
			keval.lang.setItem("current_language", language);
		})
		return API.lang.getLangPack(this.langPack, this.langCode).catch(error => {
			this.langCode = "en"; //reset values
			this.langPack = "tdesktop";
			return API.lang.getLangPack(this.langPack, this.langCode)
		}).then(diff => {
			let strings = new Map();
			for(let item of diff.strings) {
				let wrapped = this.wrapString(item);
				strings.set(wrapped.key, wrapped.value);
			}
			keval.lang.setItem("lang_code", this.langCode);
			return this.saveMap(strings, diff.version)
		})
	}

	async checkUpdates() {
		let savedVersion = await keval.lang.getItem("strings_version_"+this.langCode);
		let diff = await API.lang.getDifference(this.langPack, this.langCode, savedVersion);
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
    	let pluralCode = this.langCode; //usually true, fix it if something went wrong
    	return makePlural[pluralCode](count);
    }

}

export default new Locale()