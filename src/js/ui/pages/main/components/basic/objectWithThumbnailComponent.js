import Component from "../../../../v/vrdom/Component";

export class ObjectWithThumbnailComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            object: props.props.object,
            loading: true
        }

        this.loadObject()
    }

    h() {
        const object = this.state.object.real
        const thumb = object.thumbnail
        return <figure className={[this.props.type, thumb ? "thumbnail" : ""]}>
            {
                !thumb ?
                    this.props.slotLoaded(this.state.object, object)
                    :
                    (object.size.width > object.size.height ?
                            this.props.slotLoadingWidth(this.state.object, object)
                            :
                            this.props.slotLoadingHeight(this.state.object, object)
                    )
            }
            {
                thumb ?
                    <div className="progress" onClick={this.toggleLoading}>
                        <div className="pause-button">
                            <i className={["tgico", this.state.loading ? "tgico-close" : "tgico-download"]}/>
                        </div>
                        <progress className={["progress-circular", "big", "white", this.state.loading ? "" : "paused"]}/>
                    </div>
                    : ""
            }
        </figure>
    }

    loadObject() {
        this.props.loadObject(this.state.object, this.onProgress.bind(this)).then(l => {
            this.state.loading = false
            this.__patch()
        })
    }

    onProgress(downloaded, total) {
        return this.state.loading
    }

    toggleLoading(ev) {
        this.state.loading = !this.state.loading
        if(this.state.loading) this.loadObject()
        this.__patch()
    }

}