function LoaderFragment({big = true, white = false, full = false, show = true, id = "", background = false, loaderRef}) {

    const classes = {
        "full-size-loader": true,
        "height": !full,
    }

    const progressClasses = {
        "progress-circular": true,
        "big": big,
        "white": white
    }

    return (
        <div ref={loaderRef} id={id} css-display={!show ? "none" : ""} className={classes}>
            {
                background ? (
                    <div className="progress-background">
                        <progress className={progressClasses}/>
                    </div>
                    ):(
                    <progress className={progressClasses}/>
                )
            }
        </div>
    )
}

export default LoaderFragment