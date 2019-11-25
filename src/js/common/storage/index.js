import {TemporaryStorage} from "./temporaryStorage"
import {PermanentStorage} from "./permanentStorage"
import Random from "../../mtproto/utils/random"


export function createTemporaryStorage(name = Random.nextInteger()) {
    return new TemporaryStorage({
        name: name
    })
}

export const AppTemporaryStorage = createTemporaryStorage("App")
export const AppPermanentStorage = new PermanentStorage()
