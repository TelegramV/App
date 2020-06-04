export const PhotoFragment = ({id, url = "", width = 0, height = 0, maxWidth = 0, maxHeight = 0, calculateSize = false, ...otherArgs}) => {
    if (!calculateSize) {
        return <img id={id} src={url} alt="Image" {...otherArgs}/>
    }

    const calculatedWidth = Math.min(1, maxHeight / height) * width
    const calculatedHeight = Math.min(1, maxWidth / width) * height

    if (width >= height) {
        if (width >= 470) {
            return <img id={id} src={url} alt="Image" css-width={width && `${width}px`}
                        css-height={calculatedHeight && `${calculatedHeight}px`} {...otherArgs}/>
        } else {
            return <img id={id} src={url} alt="Image" css-width={width && `${width}px`}
                        css-height={height && `${height}px`} {...otherArgs}/>
        }
    } else { // height={height ? `${height}px` : undefined}
        // TODO calculate height?
        if (height > 512) {
            return <img id={id} src={url} alt="Image" css-width={calculatedWidth && `${calculatedWidth}px`}
                        css-height={height && `${height}px`} {...otherArgs}/>
        } else {
            return <img id={id} src={url} alt="Image" css-width={width && `${width}px`}
                        css-height={height && `${height}px`} {...otherArgs}/>

        }
    }
}