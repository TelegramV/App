import MTProto from "../../MTProto/external"
import PeersStore from "../Store/PeersStore"
import DialogsStore from "../Store/DialogsStore"
import DialogsManager from "../Dialogs/DialogsManager"
import {AppPermanentStorage} from "../Common/Storage"
import VApp from "../../V/vapp"

export function logout() {
    return MTProto.logout().then(() => {
        for (const k of PeersStore.data.keys()) {
            PeersStore.data.get(k).clear()
        }

        for (const k of DialogsStore.data.keys()) {
            DialogsStore.data.get(k).clear()
        }

        DialogsManager.onLogout()

        AppPermanentStorage.removeItem("authorizationData")
        AppPermanentStorage.removeItem("topPeers")

        VApp.router.replace("/login")
    })
}