let colors = [
    "#E93A3A", //red
    "#4FAE4E", //green
    "#4BA8FD", //blue
    "#F58505", //yellow
]

function getColor(extension) {
    extension = extension.toLowerCase();

    switch (extension) {
        case "pdf": //red
        case "ppt":
        case "pptx":
        case "key":
            return colors[0];
        case "xls": //green
        case "xlsx":
        case "csv":
            return colors[1];
        case "doc": //blue
        case "docx":
        case "rtf":
        case "txt":
        case "psd":
            return colors[2];
        case "zip": //yellow
        case "7z":
        case "rar":
        case "tar":
        case "ai":
        case "mp3":
        case "mov":
        case "avi":
            return colors[3];
        default:
            return colors[extension.charCodeAt(0) % 4];
    }
}

function getFilename(attrs, pfn) {
    if (!attrs) {
        return pfn;
    }
    for (const elem of attrs) {
        if (elem._ === "documentAttributeFilename") {
            return elem.file_name;
        }
    }
    return pfn;
}

function createIcon(color, isFull = false) {
    let id = Math.random().toString(16).substring(7);
    let darker = adjust(color, -40);
    // TODO @kohutd patching the icon and changing it to full causes it to dissapear
    // fixed.
    if (!isFull) {
        return (
            <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <g id={id} stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <path
                        d="M54,22 C54,19.790861 52.209139,18 50,18 L40,18 C37.790861,18 36,16.209139 36,14 L36,4 C36,1.790861 34.209139,-4.05812251e-16 32,0 L33.8020203,8.8817842e-15 C35.3933192,1.00028247e-14 36.9194427,0.632141042 38.0446609,1.75735931 L52.2426407,15.9553391 C53.367859,17.0805573 54,18.6066808 54,20.1979797 L54,22 Z"
                        id="Corner" fill={darker}/>
                    <path
                        d="M36,4 L36,14 C36,16.209139 37.790861,18 40,18 L50,18 C52.209139,18 54,19.790861 54,22 L54,48 C54,51.3137085 51.3137085,54 48,54 L6,54 C2.6862915,54 0,51.3137085 0,48 L0,6 C0,2.6862915 2.6862915,0 6,0 L32,0 C34.209139,-4.05812251e-16 36,1.790861 36,4 Z"
                        id="Base" fill={color}/>
                </g>
            </svg>
        )
    } else {
        return (
            <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <rect rx="6" ry="6" fill={color} width="54" height="54"/>
            </svg>
        )
    }
}

function adjust(color, amount) {
    return '#' + color
        .replace(/^#/, '')
        .replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

function formatSize(size) {
    if (!size) {
        return "0B"
    }

    const i = Math.floor(Math.log(size) / Math.log(1024))
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

export const DocumentMessagesTool = {
    getColor,
    getFilename: getFilename,
    createIcon,
    adjust,
    formatSize
}