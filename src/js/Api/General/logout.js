import MTProto from "../../MTProto/External"
import PeersStore from "../Store/PeersStore"
import DialogsStore from "../Store/DialogsStore"
import DialogsManager from "../Dialogs/DialogsManager"
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

        localStorage.removeItem("user")
        localStorage.removeItem("topPeers")

        VApp.router.replace("/login")
    })
}