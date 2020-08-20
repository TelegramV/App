import keval from "../../Keval/keval"
import MTProto from "../../MTProto/External"
import AppEvents from "../EventBus/AppEvents"

class Settings {

    settings = {}

    async init() {
    	const now = performance.now();
        await keval.getItem("settings").then(data => {
            this.settings = data || {};
        }).then(async () => {
        	let promises = [];
        	promises.push(MTProto.invokeMethod("help.getConfig").then(config => {
	            this.setNoSave("config", config)
	        }))

	        promises.push(MTProto.invokeMethod("help.getAppConfig").then(appConfig => {
	            this.setNoSave("app_config", appConfig);
	        }))

	        promises.push(MTProto.invokeMethod("help.getNearestDc").then(nearestDc => {
	            this.setNoSave("nearest_dc", nearestDc);
	        }))
	        return Promise.all(promises);
        })
        AppEvents.General.fire("settings.ready");
        return this.settings;
    }

    get(path, defaultVal) {
        let paths = path.split('.')
        if(path[0]==="settings") paths.shift();
        let current = this.settings

        for (let step of paths) {
            if (current[step] == undefined) {
                return defaultVal;
            } else {
                current = current[step];
            }
        }
        return current ?? defaultVal;
    }

    set(path, value) {
    	this.setNoSave(path, value);
    	this.save();
    }

    setNoSave(path, value) {
    	let paths = path.split('.')
    	if(path[0]==="settings") paths.shift();
        let current = this.settings

        for (let i = 0; i<paths.length-1; i++) { //
        	let step = paths[i]
            if (current[step] == undefined) current[step] = {}; // create new objects while traversing on path
            current = current[step];
        }
        current[paths[paths.length-1]] = value;
    }

    save() {
    	return keval.setItem("settings", this.settings);
    }

}

export default new Settings();