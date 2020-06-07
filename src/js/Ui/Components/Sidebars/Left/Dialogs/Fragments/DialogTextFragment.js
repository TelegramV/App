export const actionTypesMapping = {
    sendMessageTypingAction: "is typing",
    sendMessageRecordVideoAction: "is recording a video",
    sendMessageUploadVideoAction: "is uploading a video",
    sendMessageRecordAudioAction: "is recording a voice message",
    sendMessageUploadAudioAction: "is uploading a voice message",
    sendMessageUploadPhotoAction: "is uploading a photo",
    sendMessageUploadDocumentAction: "is uploading a file",
    sendMessageGeoLocationAction: "is selecting a location to share",
    sendMessageChooseContactAction: "is selecting a contact to share",
    sendMessageGamePlayAction: "is playing a game",
    sendMessageRecordRoundAction: "is recording a round video to share",
    sendMessageUploadRoundAction: "is uploading a round video",
}

function Draft({id, text, entities}) {
    return (
        <div id={id} className="message">
            <span className="draft">Draft: </span>
            {text/*parseMessageEntities(text, entities, true)*/}
        </div>
    )
}

function Action({id, user, action}) {
    return (
        <div id={id} className="message loading-text">
            <span className="sender">{user}</span>
            {" " + action}
        </div>
    )
}

function Text({id, user, text, entities}) {
    if (text.length > 100) {
        text = text.substring(0, 100)
    }

    return (
        <div id={id} className="message">
            <span className="sender">{user}</span>
            {text/*parseMessageEntities(text, entities, true)*/}
        </div>
    )
}

/**
 * @param id
 * @param {Dialog} dialog
 * @return {*}
 * @constructor
 */
export const DialogTextFragment = ({id, dialog}) => {
    if (dialog.draft.isPresent) {
        return (
            <Draft id={id} text={dialog.draft.message} entities={dialog.draft.entities}/>
        )
    } else if (dialog.actions.size > 0) {
        const action = dialog.actionText

        if (action) {
            return <Action user={action.user} action={action.action}/>
        }
    }

    return (
        <Text id={id}
              user={dialog.peer.messages.last.prefix}
              text={dialog.peer.messages.last.text.substring(0, 100)}
              entities={dialog.peer.messages.last.raw.entities}/>
    )
}
