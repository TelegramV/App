import {isBullshitBrowser} from "./utils"

const safari = isBullshitBrowser();

class WebpHelper {
    webp = null;
    
    queue = [];
    pendingPromise = false;

    constructor() {
    	if(safari) {
			import("webp-hero").then(({WebpMachine}) => this.webp = new WebpMachine());
		}
    }

    shouldConvert() {
    	return safari;
    }

    convertToPng(blob) {
    	if(!this.webp) return Promise.resolve(URL.createObjectURL(blob));
        return this.enqueue(async () => {
            let buffer = await blob.arrayBuffer()
            return this.webp.decode(new Uint8Array(buffer));
        });
    }

    enqueue(promise) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                promise,
                resolve,
                reject,
            });
            this.dequeue();
        });
    }

    dequeue() {
        if (this.workingOnPromise) {
            return false;
        }
        const item = this.queue.shift();
        if (!item) {
            return false;
        }
        try {
            this.workingOnPromise = true;
            item.promise()
                .then((value) => {
                    this.workingOnPromise = false;
                    item.resolve(value);
                    this.dequeue();
                })
                .catch(err => {
                    this.workingOnPromise = false;
                    item.reject(err);
                    this.dequeue();
                })
        } catch (err) {
            this.workingOnPromise = false;
            item.reject(err);
            this.dequeue();
        }
        return true;
    }
}

export default new WebpHelper();