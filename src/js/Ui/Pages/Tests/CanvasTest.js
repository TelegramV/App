import { askForFile } from "../../Utils/utils"
import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent"

class CanvasPage extends StatelessComponent {

    render() {
        return (
            <div style="display: flex; flex-direction: column;">
				<button onClick={() => this.buttonClick()}>Select image</button>
		    </div>
        )
    }

    buttonClick() {
        askForFile("image/*", (bytes, file) => {
            this.makeSticker(new Blob([bytes], { type: file.type })).then(blob => {
            	console.log(URL.createObjectURL(blob));
            })
        }, true);
    }

    makeSticker(blob) {
        return new Promise((resolve, reject) => {
            let canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            let context = canvas.getContext("2d");

            let img = new Image();

            img.onload = function() {
	            let max = Math.max(img.width, img.height);
	            let size = 512 / max;
	            context.drawImage(img, 0, 0, img.width * size, img.height * size);
	            context.canvas.toBlob(blob => {
	                resolve(blob);
	                canvas.remove();
	            }, "image/webp", 1);
	        }

            img.src = URL.createObjectURL(blob);
        });
    }
}

export default function CanvasTestPage() {
    return <div><CanvasPage/></div>;
}