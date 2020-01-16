import {parseMessageEntities} from "../../../../../../mtproto/utils/htmlHelpers"
import MessageWrapperComponent from "./messageWrapperComponent"
import MessageTimeComponent from "./messageTimeComponent"

function TextMessageComponent({message}) {
    let classes = {
        "bubble": true,
        "read": message.isRead
    }

    const username = message.from.peerName && !message.isPost && !message.isOut
    let text = parseMessageEntities(message.text, message.entities)

    if (message.rawMessage.fwd_from) {
        return (
            <MessageWrapperComponent message={message}>
                <div className={classes}>
                    {username ? <div className="username">{message.from.peerName}</div> : ""}

                    <div className={`message ${username ? "nopad" : ""}`}>
                        <div className="fwd">Forwarded from {message.rawMessage.fwd_from.from_id}</div>
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
                {username ? <div className="username">{message.from.peerName}</div> : ""}

                <div className={`message ${username ? "nopad" : ""}`}>
                    <span dangerouslySetInnerHTML={text}/>
                    <MessageTimeComponent message={message}/>
                </div>
            </div>
        </MessageWrapperComponent>
    )
}

export default TextMessageComponent