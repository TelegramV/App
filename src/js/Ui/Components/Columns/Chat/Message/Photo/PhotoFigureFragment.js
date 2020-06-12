import {PhotoFragment} from "./PhotoFragment"
import VSpinner from "../../../../../Elements/VSpinner";

export const LoadingFragment = ({show = true, loading = true, click = undefined, progress = 0.0}) => {
    return (
        <div className="centered" css-display={show ? undefined : "none"}>
            <VSpinner determinate progress={progress} onClick={click} big background white paused={!loading}>
                <i className={["tgico", loading ? "tgico-close" : "tgico-download"]}/>
            </VSpinner>
        </div>
        // <div css-display={show ? undefined : "none"} id={id} className="progress" onClick={click}>
        //
        //     <div css-display={showPause ? undefined : "none"} className="pause-button">
        //         <i className={["tgico", loading ? "tgico-close" : "tgico-download"]}/>
        //     </div>
        //
        //     <progress
        //         className={["progress-circular", "big", "white", loading ? "" : "paused"]}/>
        // </div>
    )
}

export const PhotoFigureFragment = ({type = "photo", id, srcUrl, thumbnail, width, height, maxWidth, maxHeight, loading, loaded, clickLoader, click, progress}) => {
    return (
        <figure id={id} className={[type, !loaded ? "thumbnail" : ""]} onClick={click}>

            <PhotoFragment url={srcUrl || thumbnail}
                           width={width}
                           height={height}
                           maxWidth={maxWidth}
                           maxHeight={maxHeight} click={click}/>

            <LoadingFragment loading={loading} show={!loaded} click={clickLoader} progress={progress}/>

        </figure>
    )
}