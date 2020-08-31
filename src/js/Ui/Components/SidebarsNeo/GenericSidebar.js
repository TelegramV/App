import "./GenericSidebar.scss";
import nodeIf from "../../../V/VRDOM/jsx/helpers/nodeIf";
import FloatingActionButton from "./Fragments/FloatingActionButton";
import TranslatableStatefulComponent from "../../../V/VRDOM/component/TranslatableStatefulComponent";
import classIf from "../../../V/VRDOM/jsx/helpers/classIf";
import UIEvents from "../../EventBus/UIEvents";
import VSimpleLazyInput from "../../Elements/Input/VSimpleLazyInput";
import VComponent from "../../../V/VRDOM/component/VComponent";
import Search from "./Fragments/Search";

export class GenericSidebar extends TranslatableStatefulComponent {
    searchInputRef = VComponent.createComponentRef()

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
                {nodeIf(<FloatingActionButton icon={this.floatingActionButtonIcon} fixed={this.isFloatingActionButtonFixed} hidden={this.isFloatingActionButtonHidden} onClick={this.onFloatingActionButtonPressed}/>, !!this.floatingActionButtonIcon)}
            </div>
        )
    }

    header() {
        return <div className={{
            header: true,
            border: this.headerBorder
        }}>
            {nodeIf(<i className={"btn-icon rp rps tgico-" + this.leftButtonIcon} onClick={this.onLeftButtonPressed}/>, this.leftButtonIcon)}
            {nodeIf(<div className="title">{this.title}</div>, !this.isSearchAsTitle)}
            {nodeIf(<div className="title search">
                <Search placeholder={this.searchPlaceholder} r={this.searchInputRef} onInput={this.onSearchInputUpdated} onFocus={this.onSearchInputFocus} lazyLevel={this.searchLazyLevel} value={this.state.inputValue}/>
                {/*<div className="input-search">*/}
                {/*    <VSimpleLazyInput type="text" placeholder="Search"*/}
                {/*                      ref={this.searchInputRef}*/}
                {/*                      onInput={this.onSearchInputUpdated}*/}
                {/*                      onFocus={this.onSearchInputFocus}*/}
                {/*                      lazyLevel={this.searchLazyLevel}/>*/}
                {/*    <span className="tgico tgico-search"/>*/}
                {/*</div>*/}
            </div>, this.isSearchAsTitle)}
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

        this.onHide();
    }

    onHide() {
        
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

        if(!this.state.fadeOut) {
            this.onShown(params)
        }

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
    contentWrapper({scrollable = true, onScroll}, slot) {
        return <div className={{
            content: true,
            scrollable
        }} onScroll={onScroll}>
            {slot}
        </div>
    }

    onSearchInputUpdated = (event) => {

    }

    onSearchInputFocus = (event) => {

    }

    onLeftButtonPressed = (event) => {
        UIEvents.Sidebars.fire("pop", this)
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


    get searchLazyLevel() {
        return 500
    }

    get isSearchAsTitle() {
        return false
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
     * Fix FAB to not hide if not hovered
     * @return {boolean}
     */
    get isFloatingActionButtonFixed() {
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

    get searchPlaceholder() {
        return this.l("lng_dlg_filter", {}, "Search");
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