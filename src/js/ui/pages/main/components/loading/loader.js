const LoaderComponent = {
    name: "loader-component",
    h({big = true, full = false, show = true, id = ""}) {
        const classes = ["full-size-loader"]
        const progressClasses = ["progress-circular"]
        if (big) {
            progressClasses.push("big")
        }
        if (!full) {
            classes.push("height")
        }
        return (
            <div id={id} css-display={!show ? "none" : ""} className={classes}>
                <progress className={progressClasses}/>
            </div>
        )
    }
}

export default LoaderComponent