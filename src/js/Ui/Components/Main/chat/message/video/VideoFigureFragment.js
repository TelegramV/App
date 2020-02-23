export const VideoPreviewFragment = ({type = "video", round = false, id, thumbSrc, width, height, maxHeight, maxWidth, loading, loaded, clickLoader}) => {
    width = height < maxHeight ? width : maxHeight / height * width;
    height = height < maxHeight ? height : maxHeight;

    height = width < maxWidth ? height : maxWidth / width * height;
    width = width < maxWidth ? width : maxWidth;

    return (
        <figure id={id} className={[type, round ? "round" : ""]}>
            <img class="video-preview"
                 src={thumbSrc}
                 width={width}
                 height={height}
            />
            <LoadingFragment loading={loading} show={!loaded} click={clickLoader}/>
        </figure>
    )
}

export const LoadingFragment = ({id, loading = false, click = undefined, show = true, showPause = true}) => {
    return (
        <div css-display={show ? "" : "none"} id={id} className="progress" onClick={click}>

            <div css-display={showPause ? "" : "none"} className="pause-button">
                <i className={["tgico", loading ? "tgico-close" : "tgico-play"]}/>
            </div>

            <progress
                className={["progress-circular", "big", "white", loading ? "" : "paused"]}/>
        </div>
    )
}

export const VideoFigureFragment = ({type = "video", id, srcUrl, round = false, width, height, maxHeight, maxWidth, loop = false, muted, autoplay = true, controls = true, click}) => {
    width = height < maxHeight ? width : maxHeight / height * width;
    height = height < maxHeight ? height : maxHeight;

    height = width < maxWidth ? height : maxWidth / width * height;
    width = width < maxWidth ? width : maxWidth;

    return (
        <figure id={id} className={[type, round ? "round" : ""]}>
            <video controls={controls === false ? undefined : true}
                   src={srcUrl}
                   width={width}
                   height={height}
                   loop={loop === false ? undefined : true}
                   autoplay={autoplay}
                   onCanPlay={l => l.target.volume = 0}
                   onClick={click}
            />
        </figure>
    )
}