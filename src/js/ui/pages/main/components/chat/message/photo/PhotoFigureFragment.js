import {PhotoFragment} from "./PhotoFragment"

const LoadingFragment = ({id, loading = true, click = undefined, show = true}) => {
    return (
        <div css-display={show ? "" : "none"} id={id} className="progress" onClick={click}>

            <div className="pause-button">
                <i className={["tgico", loading ? "tgico-close" : "tgico-download"]}/>
            </div>

            <progress
                className={["progress-circular", "big", "white", loading ? "" : "paused"]}/>
        </div>
    )
}

export const PhotoFigureFragment = ({type = "photo", message, clickLoader}) => {
    return (
        <figure id={`msg-photo-figure-${message.id}`} className={[type, message.thumbnail ? "thumbnail" : ""]}>

            <PhotoFragment url={message.srcUrl}
                           thumb={message.thumbnail}
                           width={message.width}
                           height={message.height}/>


            <LoadingFragment loading={message.loading} show={!message.loaded} click={clickLoader}/>

        </figure>
    )
}