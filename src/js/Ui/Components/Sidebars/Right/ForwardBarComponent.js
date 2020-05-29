import {RightBarComponent} from "./RightBarComponent";
import VTagsInput, {VTag} from "../../../Elements/Input/VTagsInput";
import AvatarComponent from "../../Basic/AvatarComponent";
import UIEvents from "../../../EventBus/UIEvents";
import {OnTopRightBarComponent} from "./OnTopRightBarComponent";
import PeersStore from "../../../../Api/Store/PeersStore";
import {CheckboxWithPeerFragment} from "../Fragments/CheckboxWithPeerFragment";
import DialogsStore from "../../../../Api/Store/DialogsStore";
import VComponent from "../../../../V/VRDOM/component/VComponent";
import {Dialog} from "../../../../Api/Dialogs/Dialog";
import SettingsFabFragment from "../Left/Settings/SettingsFabFragment";
import {PeerApi} from "../../../../Api/Peers/PeerApi";


class ForwardBarComponent extends OnTopRightBarComponent {

    barName = "forward-message"
    barVisible = false

    offsetId = 0
    allFetched = false
    isFetching = false
    tagsRef = VComponent.createFragmentRef()

    state = {
        from: null,
        selected: [],
        selectedMessages: [],
        filter: null
    }

    appEvents(E) {
        super.appEvents(E)

        E.bus(UIEvents.General)
            .on("message.forward", this.onForwardMessage)

        // E.bus(UIEvents.General)
        //     .on("chat.select", this.onChatSelect)
    }

    render() {
        const classes = {
            "sidebar-wrapper": true,
            "hidden": !this.barVisible
        }
        return (
            <div className={classes} onClick={_ => this.hideBar()}>
                <div class="sidebar right forward-bar on-top" onScroll={this.onScroll}
                     onClick={ev => ev.stopPropagation()}>
                    <div class="sidebar-header no-borders">
                        <span className="btn-icon tgico tgico-close rp rps" onClick={_ => this.hideBar()}/>
                        <div className="sidebar-title">Forward</div>
                    </div>
                    <div className="peers">
                        <VTagsInput tags={this.state.selected.map(peer => {
                                return <VTag peer={peer} onRemove={l => this.togglePeer(peer)}/>
                            }
                        )} onInput={this.onPeerNameInput}/>
                    </div>

                    <div className="peers-list scrollable">
                        {
                            DialogsStore.toSortedArray().map(dialog => {
                                if(!this.state.filter || dialog.peer.name.toLowerCase().includes(this.state.filter.toLowerCase())) {
                                    if(dialog.peer.canSendMessage) {
                                        return <CheckboxWithPeerFragment peer={dialog.peer}
                                                                         checked={this.state.selected.includes(dialog.peer)}
                                                                         onClick={ev => {
                                                                             this.togglePeer(dialog.peer)
                                                                         }}/>
                                    }
                                }
                                return ""
                            })
                        }
                    </div>

                    <SettingsFabFragment icon="send" onClick={this.onForwardClicked} hide={this.state.selected.length === 0}/>

                </div>
            </div>
        )
    }

    onPeerNameInput = (event) => {
        const text = event.target.value.trim()
        if(text.length === 0) {
            this.state.filter = null
        } else {
            this.state.filter = text
        }

        this.forceUpdate()
    }

    onForwardClicked = () => {
        this.state.selected.forEach(to => {
            this.state.from.api.forwardMessages({
                messages: this.state.selectedMessages,
                to: to
            })
        })
        this.hideBar()
    }



    togglePeer = (peer) => {
        if(this.state.selected.includes(peer)) {
            this.state.selected = this.state.selected.filter(l => l !== peer)
        } else {
            this.state.selected.push(peer)
        }
        this.state.filter = null
        this.forceUpdate()
        // this.tagsRef.patch({
        //     tags: this.state.selected.map(peer => {
        //             return <span className="tag">
        //              <AvatarComponent peer={peer}/>
        //              <span>{peer.name}</span>
        //             </span>
        //         }
        //     )
        // })

        // VRDOM.append(<span className="tag">
        //                     <AvatarComponent peer={peer}/>
        //                     <span>peer.name</span>
        //                 </span>, this.$el.querySelector("peers"))
    }

    onForwardMessage = event => {
        // DialogsStore.toSortedArray().forEach(l => {
        //     VRDOM.append(, this.$el.querySelector(".peers-list"))
        // })
        // this.forceUpdate()
        this.state.selectedMessages = [event.message]
        this.state.selected = []
        this.state.from = event.from
        this.openBar()
    }

    barOnShow = (event) => {
        this.forceUpdate()
    }

    barOnHide = (event) => {
        this.state.selected = []
        this.state.selectedMessages = []
        this.state.from = null
        this.forceUpdate()
    }

    onChatSelect = _ => {
        // this.hideBar()
    }

    onScroll = event => {
    }
}

export default ForwardBarComponent