import {PhotoFragment} from "./PhotoFragment"

export const LoadingFragment = ({id, loading = true, click = undefined, show = true, showPause = true}) => {
    return (
        <div css-display={show ? "" : "none"} id={id} className="progress" onClick={click}>

            <div css-display={showPause ? "" : "none"} className="pause-button">
                <i className={["tgico", loading ? "tgico-close" : "tgico-download"]}/>
            </div>

            <progress
                className={["progress-circular", "big", "white", loading ? "" : "paused"]}/>
        </div>
    )
}

export const PhotoFigureFragment = ({type = "photo", id, srcUrl, thumbnail, width, height, maxWidth, maxHeight, loading, loaded, clickLoader}) => {
    return (
        <figure id={id} className={[type, thumbnail ? "thumbnail" : ""]}>

            <PhotoFragment url={srcUrl}
                           thumb={thumbnail}
                           width={width}
                           height={height}
                           maxWidth={maxWidth}
                           maxHeight={maxHeight}/>

            <LoadingFragment loading={loading} show={!loaded} click={clickLoader}/>

        </figure>
    )
}