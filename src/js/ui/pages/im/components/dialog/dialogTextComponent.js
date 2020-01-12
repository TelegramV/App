const Draft = {
    name: "dialog-text-draft",
    h({text}) {
        return (
            <div className="message">
                <span className="draft">Draft: </span>
                {text}
            </div>
        )
    }
}

const Action = {
    name: "dialog-text-action",
    h({user, action}) {
        return (
            <div className="message">
                <span className="sender">{user}</span>
                {action}
            </div>
        )
    }
}

const Text = {
    name: "dialog-text-text",
    h({user, text}) {
        return (
            <div className="message">
                <span className="sender">{user}</span>
                {text}
            </div>
        )
    }
}

/**
 * @param {Dialog} dialog
 * @return {*}
 * @constructor
 */
export const DialogTextComponent = ({dialog}) => {
    if (dialog.draft !== null && dialog.draft._ !== "draftMessageEmpty") {
        return (
            <Draft text={dialog.draft}/>
        )
    }

    if (Object.keys(dialog.messageActions).length === 0) {
        return (
            <Text user={dialog.lastMessage.prefix}
                  text={dialog.lastMessage.text}/>
        )
    }

    // typing by default? what? fixme please
    return (
        <Action user={""}
                action={"typing..."}/>
    )
}
