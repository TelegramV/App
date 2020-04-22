import VComponent from "../../../V/VRDOM/component/VComponent"

// @deprecated ObjectWithThumbnailComponent's CLOSED DUE TO AIDS
export class ObjectWithThumbnailComponent extends VComponent {
    init() {
        this.state = {
            object: this.props.object,
            loading: true
        }

        this.loadObject()
    }

    render() {
        const object = this.state.object.real
        const thumb = object.thumbnail
        return <figure className={[this.props.type, thumb ? "thumbnail" : ""]} onClick={this.props.click}>
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
                        <progress
                            className={["progress-circular", "big", "white", this.state.loading ? "" : "paused"]}/>
                    </div>
                    : ""
            }
        </figure>
    }

    loadObject = () => {
        this.props.loadObject(this.state.object, this.onProgress.bind(this)).then(l => {
            this.setState({
                loading: false
            })
        })
    }

    onProgress = (downloaded, total) => {
        return this.state.loading
    }

    toggleLoading = (ev) => {
        if (!this.state.loading) this.loadObject()
        this.setState({
            loading: !this.state.loading
        })
    }

}