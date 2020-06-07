import StatelessComponent from "../../../../../../V/VRDOM/component/StatelessComponent";
import {DialogFragment} from "./DialogFragment";

export class DialogComponent extends StatelessComponent {
    render(props) {
        return <DialogFragment dialog={props.dialog}/>
    }

    reactive(R) {
        // why so many listeners you might ask, idk i'll answer
        R.object(this.props.dialog)
            .updateOn("updateDraftMessage")
            .updateOn("readHistory")
            .updateOn("updateUnreadCount")
            .updateOn("updateUnread")
            .updateOn("updateUnreadMark")
            .updateOn("updateReadInboxMaxId")
            .updateOn("updateReadOutboxMaxId")
            .updateOn("newMessage")
            .updateOn("editMessage")
            .updateOn("updateSingle")
            .updateOn("updatePinned")
            .updateOn("updateFolderId")
            .updateOn("updateActions")
            .updateOn("refreshed")
            .updateOn("deleted")
            .updateOn("deleteMessage")
            .updateOn("deleteMessages")

        R.object(this.props.dialog.peer)
            // .on("updatePhoto", this.onPeerUpdatePhoto)
            // .on("updatePhotoSmall", this.onPeerUpdatePhoto)
            .updateOn("updateUserStatus")
    }
}