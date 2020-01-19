function Draft({text}) {
    return (
        <div className="message">
            <span className="draft">Draft: </span>
            {text}
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

function Text({user, text}) {
    if (text.length > 50) {
        text = text.substring(0, 50)
    }

    return (
        <div className="message">
            <span className="sender">{user}</span>
            {text}
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
            <Draft text={dialog.draft.message}/>
        )
    }

    if (Object.keys(dialog.messageActions).length === 0) {
        return (
            <Text user={dialog.messages.last.prefix}
                  text={dialog.messages.last.text}/>
        )
    }

    // typing by default? what? fixme please
    return (
        <Action user={""}
                action={"typing..."}/>
    )
}
