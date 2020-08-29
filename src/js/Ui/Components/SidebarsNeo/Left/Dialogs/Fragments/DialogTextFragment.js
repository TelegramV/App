import Locale from "../../../../../../Api/Localization/Locale"

function Draft({id, text, entities}) {
    return (
        <div id={id} className="message">
            <span className="draft">Draft: </span>
            {text/*parseMessageEntities(text, entities, true)*/}
        </div>
    )
}

function Action({id, text}) {
    return (
        <div id={id} className="message loading-text">
            {text}
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
        const action = dialog.action

        if (action) {
            let actionText = Locale.lp(action);
            return <Action text={actionText}/>
        }
    }

    let text = dialog.peer.messages.last.text;
    return (
        <Text id={id}
              user={dialog.peer.messages.last.prefix}
              text={text.substring(0, 100)}
              entities={dialog.peer.messages.last.raw.entities}/>
    )
}
