export function getOS() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'mac';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'ios';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'windows';
    } else if (/Android/.test(userAgent)) {
        os = 'android';
    } else if (!os && /Linux/.test(platform)) {
        os = 'linux';
    }

    return os;
}

export function getBrowser() {
    // Opera 8.0+
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    if(isOpera) return "Opera"
    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';
    if(isFirefox) return "Firefox"
    if(IS_SAFARI) return "Safari";
    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    if(isIE) return "Internet Explorer (pls, update)"
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
    if(isEdge) return "Microsoft Edge"

    // Chrome 1 - 79
    var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    if(isChrome) return "Chrome"

    // Edge (based on chromium) detection
    var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);
    if(isEdgeChromium) return "Chromium Edge"

    return "Browser"
}

export const BROWSER = getBrowser();

export const PLATFORM = getOS();

export const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

export const IS_MOBILE_SCREEN = window.innerWidth < 991.98
export const IS_DESKTOP_SCREEN = !IS_MOBILE_SCREEN;

export const IS_VOICE_RECORDING_SUPPORTED = navigator.mediaDevices && 'getUserMedia' in navigator.mediaDevices && (
  window.AudioContext || window.webkitAudioContext
);

export const IS_STREAMING_SUPPORTED = 'MediaSource' in window;
export const IS_OPUS_SUPPORTED = Boolean((new Audio()).canPlayType('audio/ogg; codecs=opus'));

let isWebpSupportedCache;
export function isWebpSupported() {
  if (isWebpSupportedCache === undefined) {
    isWebpSupportedCache = document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp');
  }

  return isWebpSupportedCache;
}
