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

    //TODO maybe polyfill for Apple devices?
    //image - blob or url
    makeSticker(image) {
        return new Promise((resolve, reject) => {
            let canvas = document.createElement('canvas');
            let context = canvas.getContext("2d");

            let img = new Image();

            img.onload = function() {
                let max = Math.max(img.width, img.height);
                let size = 512 / max;
                canvas.width = img.width * size;
                canvas.height = img.height * size;
                context.drawImage(img, 0, 0, img.width * size, img.height * size);
                context.canvas.toBlob(blob => {
                    resolve(blob);
                    canvas.remove();
                }, "image/webp", 1);
            }

            if(image instanceof Blob) {
                img.src = URL.createObjectURL(image);
            } else {
                img.src = image;
            }
        });
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