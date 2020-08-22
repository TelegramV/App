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
