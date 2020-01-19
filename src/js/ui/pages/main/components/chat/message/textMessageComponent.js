import {parseMessageEntities} from "../../../../../../mtproto/utils/htmlHelpers"
import MessageWrapperComponent from "./messageWrapperComponent"
import MessageTimeComponent from "./messageTimeComponent"

function TextMessageComponent({message}) {
    let classes = {
        "bubble": true,
        "read": message.isRead
    }

    const username = message.from.name && !message.isPost && !message.isOut
    let text = parseMessageEntities(message.text, message.entities)

    if (message.raw.fwd_from) {
        return (
            <MessageWrapperComponent message={message}>
                <div className={classes}>
                    {username ? <div className="username">{message.from.name}</div> : ""}

                    <div className={`message ${username ? "nopad" : ""}`}>
                        <div className="fwd">Forwarded from {message.raw.fwd_from.from_id}</div>
                        {text}
                        {/*<span dangerouslySetInnerHTML={text}/>*/}
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
                    {text.map(l => "lol")}
                    {/*<span dangerouslySetInnerHTML={text}/>*/}
                    <MessageTimeComponent message={message}/>
                </div>
            </div>
        </MessageWrapperComponent>
    )
}

export default TextMessageComponent