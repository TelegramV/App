import {parseMessageEntities} from "../../../../../../mtproto/utils/htmlHelpers";

function Draft({id, text, entities}) {
    return (
        <div id={id} className="message">
            <span className="draft">Draft: </span>
            {parseMessageEntities(text, entities, true)}
        </div>
    )
}

function Action({id, user, action}) {
    return (
        <div id={id} className="message">
            <span className="sender">{user}</span>
            {action}
        </div>
    )
}

function Text({id, user, text, entities}) {
    if (text.length > 50) {
        text = text.substring(0, 50)
    }

    return (
        <div id={id} className="message">
            <span className="sender">{user}</span>
            {parseMessageEntities(text, entities, true)}
        </div>
    )
}

/**
 * @param id
 * @param {Dialog} dialog
 * @return {*}
 * @constructor
 */
export const DialogTextComponent = ({id, dialog}) => {
    if (dialog.draft.isPresent) {
        return (
            <Draft id={id} text={dialog.draft.message} entities={dialog.draft.entities}/>
        )
    }

    return (
        <Text id={id}
              user={dialog.messages.last.prefix}
              text={dialog.messages.last.text.substring(0, 50)} entities={dialog.messages.last.raw.entities}/>
    )
}
