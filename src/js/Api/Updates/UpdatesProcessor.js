import {UpdateManager} from "./UpdatesManager"
import MTProto from "../../MTProto/External"

/**
 * @param rawUpdate
 * @return {boolean}
 */
export function hasUpdatePts(rawUpdate) {
    return rawUpdate.pts !== undefined
}

/**
 * @param rawUpdate
 * @return {boolean}
 */
export function hasUpdatePtsCount(rawUpdate) {
    return rawUpdate.pts_count !== undefined
}

/**
 * @param {number} pts
 * @param rawUpdate
 */
export function checkUpdatePts(pts, rawUpdate) {
    if (hasUpdatePts(rawUpdate) && hasUpdatePtsCount(rawUpdate)) {
        if ((pts + rawUpdate.pts_count) === rawUpdate.pts) {
            return MTProto.UpdatesManager.UPDATE_CAN_BE_APPLIED;
        } else if ((pts + rawUpdate.pts_count) > rawUpdate.pts) {
            return MTProto.UpdatesManager.UPDATE_WAS_ALREADY_APPLIED
        } else {
            return MTProto.UpdatesManager.UPDATE_CANNOT_BE_APPLIED
        }
    } else {
        return MTProto.UpdatesManager.UPDATE_HAS_NO_PTS
    }
}

export class UpdatesQueue {
    isProcessing = false
    isWaitingForDifference = false

    constructor(queue = []) {
        this.queue = queue
    }

    shift = () => {
        return this.queue.shift()
    }

    push = rawUpdate => {
        this.queue.push(rawUpdate)
    }

    get length() {
        return this.queue.length
    }
}

export class UpdatesProcessor {
    updatesManager: UpdateManager

    updateTypes = []
    differenceUpdateTypes = []

    constructor(updatesManager: UpdateManager) {
        this.updatesManager = updatesManager
    }

    applyUpdate(rawUpdate) {
        this.updatesManager.fire(rawUpdate)
    }

    enqueue(rawUpdate) {
        //
    }

    processQueue(queue: UpdatesQueue) {
        //
    }

    processWithValidation(queue: UpdatesQueue, rawUpdate, pts: number) {
        //
    }

    processDifference(queue: UpdatesQueue, rawDifference) {
        //
    }
}