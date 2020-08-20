import StatefulComponent from "./StatefulComponent"
import UIEvents from "../../../Ui/EventBus/UIEvents"
import Locale from "../../../Api/Localization/Locale"

class TranslatableStatefulComponent<P> extends StatefulComponent<P> {

	// ALWAYS CALL SUPER!!!
	appEvents(E) {
		E.bus(UIEvents.General)
		.updateOn("language.changed")
		.updateOn("language.ready")
	}

	l(key, replaces, defaultValue) {
		return Locale.l(key, replaces, defaultValue);
	}

	lp(key, count, replaces, defaultValue) {
		return Locale.lp(key, count, replaces, defaultValue);
	}
}

export default TranslatableStatefulComponent;