import {parseMessageEntities} from "../../../../../../mtproto/utils/htmlHelpers"
import MessageWrapperComponent from "./messageWrapperComponent"
import MessageTimeComponent from "./messageTimeComponent"

function TextMessageComponent({message}) {
    let classes = {
        "bubble": true,
        "read": message.isRead
    }

    const username = message.from.name && !message.isPost && !message.isOut
    // let text = parseMessageEntities(message.text, message.entities)
    let text = "unparsed"

    if (message.raw.fwd_from) {
        return (
            <MessageWrapperComponent message={message}>
                <div className={classes}>
                    {username ? <div className="username">{message.from.name}</div> : ""}

                    <div className={`message ${username ? "nopad" : ""}`}>
                        <div className="fwd">Forwarded from {message.raw.fwd_from.from_id}</div>
                        <span dangerouslySetInnerHTML={text}/>
                        <MessageTimeComponent message={message}/>
                    </div>
                </div>
            </MessageWrapperComponent>
        )
    }

    return (
        <MessageWrapperComponent message={message}>
            <div className={classes}>
                {username ? <div className="username">{message.from.name}</div> : ""}

                <div className={`message ${username ? "nopad" : ""}`}>
                    <span dangerouslySetInnerHTML={text}/>
                    <MessageTimeComponent message={message}/>
                </div>
            </div>
        </MessageWrapperComponent>
    )
}

export default TextMessageComponent