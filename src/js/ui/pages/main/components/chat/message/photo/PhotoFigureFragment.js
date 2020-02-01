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

export const PhotoFigureFragment = ({type = "photo", id, srcUrl, thumbnail, width, height, loading, loaded, clickLoader}) => {
    return (
        <figure id={id} className={[type, thumbnail ? "thumbnail" : ""]}>

            <PhotoFragment url={srcUrl}
                           thumb={thumbnail}
                           width={width}
                           height={height}/>

            <LoadingFragment loading={loading} show={!loaded} click={clickLoader}/>

        </figure>
    )
}