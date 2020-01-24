function LoaderComponent({big = true, full = false, show = true, id = ""}) {

    const classes = {
        "full-size-loader": true,
        "height": !full,
    }

    const progressClasses = {
        "progress-circular": true,
        "big": big
    }

    return (
        <div id={id} css-display={!show ? "none" : ""} className={classes}>
            <progress className={progressClasses}/>
        </div>
    )
}

export default LoaderComponent