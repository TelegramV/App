//     telegram-mt-node
//     Copyright 2014 Enrico Stara 'enrico.stara@gmail.com'
//     Released under the MIT License
//     https://github.com/enricostara/telegram-mt-node

// Export functions
// Time offset between local time and server time
var timeOffset = 0;
var lastResponse = Number.MAX_VALUE;

export function getLocalTime() {
    var logger = console;
    var offset = (timeOffset * 1000);
    var localtime = new Date().getTime() + offset;
    logger.debug("Return the local TIME (synchronized with the server) %s and timeOffset %s", localtime, offset);
    return localtime;
}

// Synchronize the local time with the server time
export function timeSynchronization(serverTime, requestDuration) {
    var logger = console;
    var localTime = Math.floor(new Date().getTime() / 1000);
    var response = requestDuration / 2;
    logger.debug('ServerTime %ss - LocalTime %ss - Response in %sms',
        serverTime, localTime, response);
    if (lastResponse > response) {
        lastResponse = response;
        response = Math.floor(response / 1000);
        timeOffset = ((serverTime + response) - localTime);

        logger.debug('time-synchronization: (ServerTime %ss + server-response %ss) - LocalTime %ss = timeOffset %ss',
            serverTime, response, localTime, timeOffset);

    } else {
        logger.debug('NO time-synchronization: the server-response (%s) took more time than the previous one (%s)',
            response, lastResponse);
    }
}

export default {
    getLocalTime,
    timeSynchronization
}