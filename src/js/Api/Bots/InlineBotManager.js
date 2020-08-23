import API from "../Telegram/API"
import Settings from "../Settings/Settings"

class InlineBotManager {

	gifBotUser = null
	gitBotUsername = "gif"

	// {"BOT-ID_gif_search_QUERY_OFFSET", {cached: timestamp, result: {...}}}
	cache = new Map();
	
	init() {
		Settings.initPromise.then(() => {
			this.botUsername = Settings.get("config.gif_search_username");
			return API.contacts.resolveUsername(this.botUsername);
		}).then(resolvedPeer => {
			this.gifBotUser = resolvedPeer.users[0].input;
		})

		window.bots = this;
	}

	searchGifs(inputChatPeer, query, offset = "") {
		const tryCache = this.cache.get(this.makeGifKey(this.gifBotUser, query, offset));
		if(tryCache && (tryCache.cached + tryCache.result.cache_time*1000) > Date.now()) {
			return Promise.resolve(tryCache.result);
		}

		return API.bot.getInlineBotResults(this.gifBotUser, inputChatPeer, query, offset).then(result => {
			this.cacheGifResult(this.gifBotUser, query, result, offset);
			return result;
		});
	}

	cacheGifResult(bot, query, result, offset) {
		this.cache.set(this.makeGifKey(bot, query, offset), {
			cached: Date.now(),
			result
		})
		return result
	}

	makeGifKey(bot, query, offset) {
		return `${bot.user_id}_gif_search_${query}_${offset}`;
	}

}

export default new InlineBotManager();