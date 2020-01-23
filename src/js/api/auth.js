import {MTProto} from "../mtproto";

export class AuthAPI {
    static exportAuth(dcID) {
        return MTProto.invokeMethod("auth.exportAuthorization", {
            dc_id: dcID
        })
    }

    static importAuth(exportedAuth, dcID) {
        return MTProto.invokeMethod("auth.importAuthorization", {
            id: exportedAuth.id,
            bytes: exportedAuth.bytes
        }, dcID)
    }
}