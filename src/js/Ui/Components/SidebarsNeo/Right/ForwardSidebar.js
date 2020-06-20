import "./ForwardSidebar.scss";
import VTagsInput, {VTag} from "../../../Elements/Input/VTagsInput";
import DialogsStore from "../../../../Api/Store/DialogsStore";
import VComponent from "../../../../V/VRDOM/component/VComponent";
import UIEvents from "../../../EventBus/UIEvents";
import {GenericSidebar} from "../GenericSidebar";
import nodeIf from "../../../../V/VRDOM/jsx/helpers/nodeIf";
import FloatingActionButton from "../Fragments/FloatingActionButton";
import classIf from "../../../../V/VRDOM/jsx/helpers/classIf";
import {Section} from "../Fragments/Section";
import AvatarCheckmarkButton from "../Fragments/AvatarCheckmarkButton";

export class ForwardSidebar extends GenericSidebar {
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

    get classes() {
        const c = super.classes
        c.push("forward")
        c.push("right")
        return c
    }

    render(): * {
        return (
            <div className={["forward-wrapper", classIf(this.state.hidden, "hidden"), classIf(this.state.reallyHidden, "really-hidden")]} onClick={this.onClickBehind}>
                <div className={this.classes} onAnimationEnd={this.onTransitionEnd} onClick={event => event.stopPropagation()}>
                    {this.header()}
                    {this.content()}
                    {nodeIf(<FloatingActionButton icon={this.floatingActionButtonIcon} hidden={this.isFloatingActionButtonHidden} onClick={this.onFloatingActionButtonPressed}/>, !!this.floatingActionButtonIcon)}
                </div>
            </div>
        )
    }

    onClickBehind = (event) => {
        this.hide()
    }

    // TODO move tags to title!
    content(): * {
        return <this.contentWrapper>
            <div className="peers">
                <VTagsInput tags={this.state.selected.map(peer => {
                        return <VTag peer={peer} onRemove={l => this.togglePeer(peer)}/>
                    }
                )} onInput={this.onPeerNameInput} value={this.state.filter}/>
            </div>

            <Section>
                {
                    DialogsStore.toSortedArray().map(dialog => {
                        if(!this.state.filter || dialog.peer.name.toLowerCase().includes(this.state.filter.toLowerCase())) {
                            if(dialog.peer.canSendMessage) {
                                return <AvatarCheckmarkButton peer={dialog.peer}
                                                     isNameAsText isStatusAsDescription
                                                                 checked={this.state.selected.includes(dialog.peer)}
                                                                 onClick={ev => {
                                                                     this.togglePeer(dialog.peer)
                                                                 }}/>
                            }
                        }
                        return ""
                    })
                }
            </Section>
        </this.contentWrapper>
    }

    onLeftButtonPressed = (event) => {
        this.hide()
    }

    appEvents(E) {
        super.appEvents(E)

        E.bus(UIEvents.General)
            .on("message.forward", this.onForwardMessage)
    }

    onFloatingActionButtonPressed = () => {
        this.state.selected.forEach(to => {
            this.state.from.api.forwardMessages({
                messages: this.state.selectedMessages,
                to: to
            })
        })
        this.hide()
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

    togglePeer = (peer) => {
        if(this.state.selected.includes(peer)) {
            this.state.selected = this.state.selected.filter(l => l !== peer)
        } else {
            this.state.selected.push(peer)
        }
        this.state.filter = null
        this.forceUpdate()
    }

    onForwardMessage = event => {
        console.log("WOW")
        this.state.selectedMessages = [event.message]
        this.state.selected = []
        this.state.from = event.from
        this.show()
    }

    get floatingActionButtonIcon(): string | null {
        return "send"
    }

    get isFloatingActionButtonHidden(): boolean {
        return this.state.selected.length === 0
    }

    get leftButtonIcon(): string | null {
        return "close"
    }

    get title(): string | * {
        return "Forward"
    }
}