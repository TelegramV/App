import {MTProtoInternal} from "./internal";

export class AuthAPI {
    static exportAuth(dcID, file) {
        return MTProtoInternal.invokeMethod("auth.exportAuthorization", {
            dc_id: dcID,
        }, null, file)
    }

    static importAuth(exportedAuth, dcID, file) {
        return MTProtoInternal.invokeMethod("auth.importAuthorization", {
            id: exportedAuth.id,
            bytes: exportedAuth.bytes
        }, dcID, file)
    }
}