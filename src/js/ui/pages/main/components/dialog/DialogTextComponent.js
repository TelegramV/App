import {parseMessageEntities} from "../../../../htmlHelpers";

function Draft({text, entities}) {
    return (
        <div className="message">
            <span className="draft">Draft: </span>
            {parseMessageEntities(text, entities, true)}
        </div>
    )
}

function Action({user, action}) {
    return (
        <div className="message">
            <span className="sender">{user}</span>
            {action}
        </div>
    )
}

function Text({user, text, entities}) {
    if (text.length > 50) {
        text = text.substring(0, 50)
    }

    return (
        <div className="message">
            <span className="sender">{user}</span>
            {parseMessageEntities(text, entities, true)}
        </div>
    )
}

/**
 * @param {Dialog} dialog
 * @return {*}
 * @constructor
 */
export const DialogTextComponent = ({dialog}) => {
    if (dialog.draft.isPresent) {
        return (
            <Draft text={dialog.draft.message} entities={dialog.draft.entities}/>
        )
    }

    return (
        <Text user={dialog.messages.last.prefix}
              text={dialog.messages.last.text.substring(0, 50)} entities={dialog.messages.last.raw.entities}/>
    )
}
