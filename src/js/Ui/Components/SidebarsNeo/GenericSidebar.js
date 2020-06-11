import "./GenericSidebar.scss";
import nodeIf from "../../../V/VRDOM/jsx/helpers/nodeIf";
import FloatingActionButton from "./Fragments/FloatingActionButton";
import StatefulComponent from "../../../V/VRDOM/component/StatefulComponent";
import classIf from "../../../V/VRDOM/jsx/helpers/classIf";
import UIEvents from "../../EventBus/UIEvents";

export class GenericSidebar extends StatefulComponent {
    init() {
        super.init()
        if(this.state.hidden == null) {
            this.state.hidden = true
            this.state.fadeOut = false
            this.state.reallyHidden = true
        } else {
            this.state.reallyHidden = this.state.hidden
        }
    }

    compareWith(other) {
        return this.constructor === other
    }

    render() {
        return (
            <div className={this.classes} onAnimationEnd={this.onTransitionEnd}>
                {this.header()}
                {this.content()}
                {nodeIf(<FloatingActionButton icon={this.floatingActionButtonIcon} hidden={this.isFloatingActionButtonHidden} onClick={this.onFloatingActionButtonPressed}/>, !!this.floatingActionButtonIcon)}
            </div>
        )
    }

    header() {
        return <div className={{
            header: true,
            border: this.headerBorder
        }}>
            {nodeIf(<i className={"btn-icon rp rps tgico-" + this.leftButtonIcon} onClick={this.onLeftButtonPressed}/>, this.leftButtonIcon)}
            <div className="title">{this.title}</div>
            {this.rightButtons.map(l => {
                return <i className={["btn-icon rp rps tgico-" + l.icon, l.blue ? "blue" : ""]} onClick={l.onClick}/>
            })}
        </div>
    }

    onTransitionEnd = (ev) => {
        if(ev.animationName === "fade-in") {
            this.setState({
                fadeIn: false
            })
            return
        }

        if(ev.animationName === "unhidden") {
            this.setState({
                unhidden: false
            })
            return
        }
        if((this.state.hidden || this.state.fadeOut) && !this.state.reallyHidden) {
            this.reallyHidden = true
        }
    }

    onShown(params) {

    }

    hide() {
        this.setState({
            hidden: true
        })
    }

    fadeOut() {
        this.setState({
            fadeOut: true
        })
    }

    show(params) {
        this.reallyHidden = false

        // this.withTimeout(_ => {

        this.setState({
            hidden: false,
            unhidden: this.state.hidden,
            fadeIn: this.state.fadeOut,
            fadeOut: false
        })

        this.onShown(params)
        // }, 0)
    }

    set reallyHidden(value) {
        this.setState({
            reallyHidden: value
        })
    }


    /**
     * Created to reduce nesting. Always wrap your sidebars!
     * @param scrollable
     * @param slot
     * @return {*}
     */
    contentWrapper({scrollable = true}, slot) {
        return <div className={{
            content: true,
            scrollable
        }}>
            {slot}
        </div>
    }

    onLeftButtonPressed = (event) => {
        UIEvents.Sidebars.fire("pop")
    }

    onFloatingActionButtonPressed = (event) => {

    }

    /**
     * Override this to add content to sidebar
     * @returns {*}
     */
    content() {
        throw Error("Not implemented!")
    }

    /**
     * Return name of previous bar or null if first bar
     * @returns {string|null}
     */
    // TODO replace with stack!!!
    get previous() {
        return null
    }

    /**
     * Set icon for floating action button or null to remove it completely
     * @return {string|null}
     */
    get floatingActionButtonIcon() {
       return null
    }


    get isFloatingActionButtonOnHover() {
        return false
    }

    /**
     * Hide FAB with animation using this property
     * @return {boolean}
     */
    get isFloatingActionButtonHidden() {
        return false
    }

    /**
     * Set icon for left button or null to remove it completely
     * @return {string|null}
     */
    get leftButtonIcon() {
        return "back"
    }

    /**
     * Set right buttons array, {icon: "...", blue: false, onClick: ...}
     * @return {*[]}
     */
    get rightButtons() {
        return []
    }

    /**
     * Title in the header
     * @returns {string|*}
     */
    get title() {
        return "Generic Sidebar"
    }

    /**
     * Enable bottom border for header?
     * @returns {boolean}
     */
    get headerBorder() {
        return true
    }


    get isStatic() {
        return false
    }

    get classes() {
        return ["sidebar",
            classIf(this.state.hidden, "hidden"),
            classIf(this.state.fadeOut, "fade-out"),
            classIf(this.state.fadeIn, "fade-in"),
            classIf(this.state.unhidden, "unhidden"),
            classIf(this.isFloatingActionButtonOnHover, "floating-action-button-hover"),
            classIf(this.state.reallyHidden, "really-hidden"),
        ]
    }
}