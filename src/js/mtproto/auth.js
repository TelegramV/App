import {MTProtoInternal} from "./internal";

export class AuthAPI {
    static exportAuth(dcID) {
        return MTProtoInternal.invokeMethod("auth.exportAuthorization", {
            dc_id: dcID
        })
    }

    static importAuth(exportedAuth, dcID) {
        return MTProtoInternal.invokeMethod("auth.importAuthorization", {
            id: exportedAuth.id,
            bytes: exportedAuth.bytes
        }, dcID)
    }
}