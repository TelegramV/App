function LoaderComponent({big = true, white = false, full = false, show = true, id = "", background = false}) {

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
        <div id={id} css-display={!show ? "none" : ""} className={classes}>
            {
                background ?
                    <div className="progress-background">
                        <progress className={progressClasses}/>
                    </div>
                    :
                    <progress className={progressClasses}/>

            }
        </div>
    )
}

export default LoaderComponent