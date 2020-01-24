import Component from "../../../../framework/vrdom/component";

export class ObjectWithThumbnailComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            object: props.props.object
        }

        props.props.loadObject(this.state.object).then(this.__patch.bind(this))
    }

    h() {
        const object = this.state.object.real
        const thumb = object.thumbnail
        return <figure className={[this.props.type, thumb ? "thumbnail" : ""]}>
            {
                !thumb ?
                    this.props.slotLoaded(object)
                    :
                    (object.size.width > object.size.height ?
                            this.props.slotLoadingWidth(object)
                            :
                            this.props.slotLoadingHeight(object)
                    )
            }
            {
                thumb ?
                    <div className="progress">
                        <div className="pause-button">
                            <i className="tgico tgico-close"/>
                        </div>
                        <progress className="progress-circular big white"/>
                    </div>
                    : ""
            }
        </figure>
    }

}