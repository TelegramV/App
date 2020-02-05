import Component from "../../../../../v/vrdom/Component";
import {ContextMenuManager} from "../../../../../contextMenuManager";
import {replaceEmoji} from "../../../../../utils/emoji";
import {ModalManager} from "../../../../../modalManager";
import {AttachPollModal} from "../../../modals/AttachPollModal";
import {AttachLinkModal} from "../../../modals/AttackLinkModal";

export class TextareaFragment extends Component {

    h() {
        return <div className="textarea empty"
             placeholder="Message"
             contentEditable onInput={this.onInput} onKeyPress={this.onKeyPress} onKeyDown={this.onKeyDown}
             onContextMenu={this.contextMenu} onPaste={this.onPaste}>
        </div>
    }

    mounted() {
        super.mounted();
        this.parent = this.refs.get("chatInput")
    }

    onKeyDown(ev) {
        console.log(ev)
        // Ctrl + Shift + M
        if(ev.keyCode === 77 && ev.shiftKey && ev.ctrlKey) {
            ev.preventDefault()
            this.monospace()
        }

        // Ctrl + K
        if(ev.keyCode === 75 && ev.ctrlKey) {
            ev.preventDefault()
            this.createLink()
        }

        // Ctrl + Shift + X
        if(ev.keyCode === 88 && ev.shiftKey && ev.ctrlKey) {
            ev.preventDefault()
            this.strikethrough()
        }

        // Alt + N
        if(ev.keyCode === 78 && ev.altKey) {
            ev.preventDefault()
            this.clear()
        }
    }

    createLink() {
        this.restoreSelection()
        this.saveSelection()
        let text = ""
        if(document.activeElement === this.$el) {
            text = window.getSelection().toString()
        }
        // todo move this blur & focus to modalmanager
        this.$el.blur()
        ModalManager.open(<AttachLinkModal text={text} close={this.linkCreated}/>)
    }

    saveSelection() {
        let sel = window.getSelection();
        this.range = sel.getRangeAt(0);
    }

    restoreSelection() {
        if (this.range) {
            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(this.range);
        }
        this.range = null
    }

    linkCreated(text, url) {
        this.formatBlock("createLink", url)
    }

    formatBlock(tag, param) {
        this.$el.focus()
        this.restoreSelection()
        document.execCommand(tag, false, param)
    }

    bold() {
        this.formatBlock("bold")
    }

    italic() {
        this.formatBlock("italic")
    }

    strikethrough() {
        this.formatBlock("strikeThrough")
    }

    underline() {
        this.formatBlock("underline")
    }

    monospace() {
        // HACK!
        // Unfortunately execCommand has no way to insert <code> directly.
        // Well, screw it, I ain't no worried about hacks anymore!
        // Let it be something else right?
        this.formatBlock("subscript")
    }

    clear() {
        this.formatBlock("removeFormat")
    }

    onKeyPress(ev) {
        if ((ev.which === 13 || ev.which === 10) && !ev.shiftKey && !ev.ctrlKey) {
            this.parent.send()
            ev.preventDefault()
        }
    }


    onPaste(ev) {
        ev.preventDefault()

        const text = (ev.originalEvent || ev).clipboardData.getData('text/plain')

        document.execCommand("insertText", false, text)

        for (let i = 0; i < ev.clipboardData.items.length; i++) {
            const k = ev.clipboardData.items[i]
            if (k.type.indexOf("image") === -1) continue
            // TODO add URL.createObjectURL(k.getAsFile())
        }
    }


    onInput(ev) {
        this.parent.updateSendButton()
        replaceEmoji(ev.target)
    }

    contextMenu = l => {
        this.saveSelection()
        ContextMenuManager.listener([
            {
                title: "Bold",
                after: "Ctrl+B",
                onClick: this.bold.bind(this)
            },
            {
                title: "Italic",
                after: "Ctrl+I",
                onClick: this.italic.bind(this)
            },
            {
                title: "Underline",
                after: "Ctrl+U",
                onClick: this.underline.bind(this)
            },
            {
                title: "Strikethrough",
                after: "Ctrl+Shift+X",
                onClick: this.strikethrough.bind(this)
            },
            {
                title: "Monospace",
                after: "Ctrl+Shift+M",
                onClick: this.monospace.bind(this)
            },
            {
                title: "Create link",
                after: "Ctrl+K",
                onClick: this.createLink.bind(this)
            },
            {
                title: "Normal text",
                after: "Alt+N",
                onClick: this.clear.bind(this)
            }
        ])(l)

    }

}