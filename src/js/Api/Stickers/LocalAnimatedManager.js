import MTProto from "../../MTProto/External";
import UIEvents from "../../Ui/EventBus/UIEvents";

// TODO
class LocalAnimatedManagerSingleton {
    defaultPath = "./static/animated/"
    files = {
        "filter_new": null,
        "filter_no_chats": null,
        "filters": null,
    }

    constructor() {
    }

    async fetch(file: string, path: string = this.defaultPath) {
        return fetch(path + file).then(async r => {
            return r.arrayBuffer().then(async b => {
                // "{" === 123
                const data = b[0] === 123 ? new Uint8Array(b) : await MTProto.performWorkerTask("gzipUncompress", new Uint8Array(b))
                return JSON.parse(new TextDecoder("utf-8").decode(data))
            })
        }).then(r => {
            this.files[file] = r
            UIEvents.General.fire("localAnimatedDownloaded", {
                file: file,
                data: r
            })
        }).catch(r => {
            console.error("Error while fetching local animated!", r)
        })
    }

    async loadAll() {
        return Promise.all(Object.keys(this.files).map(l => this.fetch(l)))
    }
}

const LocalAnimatedManager = new LocalAnimatedManagerSingleton()
export default LocalAnimatedManager