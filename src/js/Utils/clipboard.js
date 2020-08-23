/*
 * Copyright 2020 Telegram V authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
    } catch (err) {
        console.error('Failed to copy text to clipboard!', err);
    }

    document.body.removeChild(textArea);
}

export function copyTextToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        fallbackCopyTextToClipboard(text);
    }

}

export function copyBlobToClipboard(blob) {
	if(!navigator.clipboard) return false;

	const type = blob.type;
	if(type.includes("jpg") || type.includes("jpeg")) {
		return convertToPng(blob).then(copyBlobToClipboard);
	}

    return navigator.clipboard.write([
        new ClipboardItem({
            [blob.type]: blob
        })
    ]);
}

const createImage = (options) => {
  options = options || {};
  const img = document.createElement("img");
  if (options.src) {
    img.src = options.src;
  }
  return img;
};

function convertToPng(imgBlob) {
	return new Promise((resolve, reject) => {
		const imageUrl = window.URL.createObjectURL(imgBlob);
		  const canvas = document.createElement("canvas");
		  const ctx = canvas.getContext("2d");
		  const imageEl = createImage({ src: imageUrl });
		  imageEl.onload = (e) => {
		    canvas.width = e.target.width;
		    canvas.height = e.target.height;
		    ctx.drawImage(e.target, 0, 0, e.target.width, e.target.height);
		    canvas.toBlob(resolve, "image/png", 1);
		  }; 
	})
}