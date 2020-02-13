import MTProto from "../mtproto/external"
import PeersStore from "./store/PeersStore"
import DialogsStore from "./store/DialogsStore"
import VF from "../ui/v/VFramework"
import DialogsManager from "./dialogs/DialogsManager"

export function logout() {
    MTProto.logout().then(() => {
        for (const k of PeersStore.data.keys()) {
            PeersStore.data.get(k).clear()
        }
        for (const k of DialogsStore.data.keys()) {
            DialogsStore.data.get(k).clear()
        }
        DialogsManager.onLogout()

        VF.router.replace("/login")
    })
}