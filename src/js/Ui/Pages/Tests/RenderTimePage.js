import API from "../../../Api/Telegram/API";
import DialogsManager from "../../../Api/Dialogs/DialogsManager";
import DialogsStore from "../../../Api/Store/DialogsStore";
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent";
import TextMessageComponent from "../../Components/Columns/Chat/Message/TextMessageComponent";
import {MessageFactory} from "../../../Api/Messages/MessageFactory";
import vrdom_render from "../../../V/VRDOM/render/render";

class RenderTime extends StatefulComponent {
    messages = []
    io = new IntersectionObserver(this.onIo)

    render() {
        return (
            <div>
                {/*{this.messages.map(message => {*/}
                {/*    return <TextMessageComponent*/}
                {/*        message={message}*/}
                {/*        observer={this.io}*/}
                {/*    />*/}
                {/*})}*/}
            </div>
        )
    }

    onIo() {

    }

    componentDidMount() {
        super.componentDidMount();
        DialogsManager.fetchFirstPage().then(async _ => {
            const peer = DialogsStore.get("channel", 1460482390).peer
            let Messages = null
            let messages = []
            let offset = 0
            while (Messages == null || Messages.messages.length !== 0) {
                Messages = await API.messages.getHistory(peer, {limit: 100, offset_id: offset})
                if (offset === 1) break
                offset = Messages.messages[Messages.messages.length - 1].id
                Messages.messages.forEach(rawMessage => {
                    messages.push(MessageFactory.fromRaw(peer, rawMessage))
                })
                break
                // messages.push(...Messages.messages)
            }
            this.messages = messages
            try {
                const deltas = []
                for (let i = 0; i < 50; i++) {
                    const a = performance.now()
                    // console.time("render " + messages.length)
                    // this.forceUpdate()
                    this.messages.forEach(message => {
                        vrdom_render(<TextMessageComponent
                            message={message}
                            observer={this.io}
                        />)
                    })
                    // console.timeEnd("render " + messages.length)
                    const delta = performance.now() - a
                    deltas.push(delta)
                }

                const avg = deltas.reduce((a, b) => a + b) / deltas.length
                console.log("average for", messages.length, "is", Math.round(avg) + "ms")
            } catch (e) {
                console.error(e)
            }
        })
    }
}

export function RenderTimePage() {


    return (
        <div>
            <RenderTime/>
        </div>
    )
}