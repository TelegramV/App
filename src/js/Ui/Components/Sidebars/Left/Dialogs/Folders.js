import VComponent from "../../../../../V/VRDOM/component/VComponent";
import "./Folders.scss";
import MTProto from "../../../../../MTProto/External";

const FolderFragment = ({icon, title, badge = "", selected = false, onClick}) => {
    return <div className={{
        folder: true,
        selected
    }} onClick={onClick}>
        <i className="icon">{icon}</i>
        <span className="title">{title}</span>
        <span className="badge">{badge}</span>
    </div>
}

export class Folders extends VComponent {
    dialogFilters = []

    render() {
        return <div class={{
            "folder-list": true
        }}>
            <FolderFragment icon="🐶" title="All chats" selected/>
            {this.dialogFilters.map(l => {
                return <FolderFragment icon={l.emoticon ?? "🤪"} title={l.title} badge={1}/>
            })}

            <FolderFragment icon="⚙" title="Edit"/>
        </div>
    }

    async init() {
        super.init();
        this.dialogFilters = await MTProto.invokeMethod("messages.getDialogFilters")
        console.log(this.dialogFilters)
        this.forceUpdate()
    }
}