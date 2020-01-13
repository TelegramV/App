import {parseMessageEntities} from "../../../../../mtproto/utils/htmlHelpers"
import MessageComponent from "./messageComponent"
import MessageTimeComponent from "./messageTimeComponent"

const TextMessageComponent = {
    name: "text-only-message",

    /**
     * @param {Message} message
     * @return {*}
     */
    h({message}) {
        let classes = "bubble"

        if (message.isRead) {
            classes += " read"
        }

        const username = message.from.username && !message.isPost && !message.isOut
        let text = parseMessageEntities(message.text, message.entities)

        if (message.rawMessage.fwd_from) {
            return (
                <MessageComponent message={message}>
                    <div className={classes}>
                        {username ? <div className="username">{username}</div> : ""}

                        <div className={`message ${username ? "nopad" : ""}`}>
                            <div className="fwd">Forwarded from {message.rawMessage.fwd_from.from_id}</div>
                            <span dangerouslySetInnerHTML={text}/>
                            <MessageTimeComponent message={message}/>
                        </div>
                    </div>
                </MessageComponent>
            )
        }

        return (
            <MessageComponent message={message}>
                <div className={classes}>
                    {username ? <div className="username">{username}</div> : ""}

                    <div className={`message ${username ? "nopad" : ""}`}>
                        <span dangerouslySetInnerHTML={text}/>
                        <MessageTimeComponent message={message}/>
                    </div>
                </div>
            </MessageComponent>
        )
    }
}

export default TextMessageComponent