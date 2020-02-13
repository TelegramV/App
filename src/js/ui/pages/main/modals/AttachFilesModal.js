import VComponent from "../../../v/vrdom/component/VComponent";
import {ModalHeaderFragment} from "./ModalHeaderFragment";
import {InputComponent} from "../components/input/inputComponent";
import AppSelectedPeer from "../../../reactive/SelectedPeer";
import {FileAPI} from "../../../../api/fileAPI";
import {ModalManager} from "../../../modalManager";
import {DocumentMessagesTool} from "../components/file/DocumentMessageTool";

class FileListFragment extends VComponent {
    h() {
        return <div className="file-list">
            {this.props.blobs.map(l => {
                let title = l.file.name
                let ext = title.split(".")[title.split(".").length - 1]
                let size = DocumentMessagesTool.formatSize(l.file.size)

                let color = DocumentMessagesTool.getColor(ext)
                let icon = (
                    <div class="svg-wrapper">
                        {DocumentMessagesTool.createIcon(color)}
                        <div class="extension">{ext}</div>
                    </div>
                )
                return <div className="card">
                    <div className="card-icon">
                        {icon}
                    </div>
                    <div className="card-info">
                        <div className="title">
                            {title}
                        </div>
                        <div className="description">
                            {size}
                        </div>
                    </div>
                </div>
            })}
        </div>
    }

    addFile(blob) {
        if (this.props.blobs.length >= 10) return
        this.props.blobs.push(blob)
        this.__patch()
    }

    getMedia() {
        return Promise.all(this.props.blobs.map(async l => {
            return await FileAPI.uploadDocument(await fetch(l.blob).then(r => r.arrayBuffer()), l.file.name)
        }))
    }
}

export class AttachFilesModal extends VComponent {
    captionRef = VComponent.createComponentRef()
    fileListRef = VComponent.createComponentRef()

    h() {
        return <div className="attach-files-modal">
            <ModalHeaderFragment title="Send Files" close actionText="Send" action={this.send.bind(this)}/>
            <div className="padded">
                <FileListFragment ref={this.fileListRef} blobs={this.props.media}/>
                <InputComponent ref={this.captionRef} label="Add a caption..."/>
            </div>
        </div>
    }

    addFile(blob, file) {
        this.fileListRef.component.addFile({
            blob: blob,
            file: file
        })
    }

    async send() {
        ModalManager.close()
        const media = await this.fileListRef.component.getMedia()
        media.forEach(l => {
            AppSelectedPeer.Current.api.sendMessage({
                text: this.captionRef.component.getValue(),
                media: l
            })
        })
    }
}