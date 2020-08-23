import API from "../Telegram/API"
import Settings from "../Settings/Settings"

class InlineBotManager {

	gifBotUser = null
	gitBotUsername = "gif"

	init() {
		Settings.initPromise.then(() => {
			this.botUsername = Settings.get("config.gif_search_username");
			return API.contacts.resolveUsername(this.botUsername);
		}).then(resolvedPeer => {
			this.gifBotUser = resolvedPeer.users[0].input;
		})
	}

	searchGifs(inputChatPeer, query, offset = 0) {
		return API.bot.getInlineBotResults(this.gifBotUser, inputChatPeer, query, offset);
	}

}

export default new InlineBotManager();