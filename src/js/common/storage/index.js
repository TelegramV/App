import {nextRandomInt} from "../../mtproto/utils/bin"
import {TemporaryStorage} from "./temporaryStorage"
import {PermanentStorage} from "./permanentStorage"


export function createTemporaryStorage(name = nextRandomInt()) {
    return new TemporaryStorage({
        name: name
    })
}

export const AppTemporaryStorage = createTemporaryStorage("App")
export const AppPermanentStorage = new PermanentStorage()