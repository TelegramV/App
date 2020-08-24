export const PhotoFragment = ({ id, url = "", width = 0, height = 0, maxWidth = 470, maxHeight = 512, calculateSize = false, ...otherArgs }) => {
    if (!calculateSize) {
        return <img id={id}
                    src={url}
                    alt="Image"
                    {...otherArgs}/>
    }

    const calculatedWidth = maxWidth === 0 ? width : Math.floor(Math.min(1, maxHeight / height) * width)
    const calculatedHeight = maxHeight === 0 ? height : Math.floor(Math.min(1, maxWidth / width) * height)

    return <img id={id}
                src={url}
                alt="Image"
                css-width={calculatedWidth && `${calculatedWidth}px`}
                css-height={calculatedHeight && `${calculatedHeight}px`}
                {...otherArgs}/>

    // if (width >= height) {
    //     if (width >= 470) {
    //         return <img id={id} src={url} alt="Image" css-width={calculatedWidth && `${calculatedWidth}px`}
    //                     css-height={calculatedHeight && `${calculatedHeight}px`} {...otherArgs}/>
    //     } else {
    //         return <img id={id} src={url} alt="Image" css-width={width && `${width}px`}
    //                     css-height={height && `${height}px`} {...otherArgs}/>
    //     }
    // } else { // height={height ? `${height}px` : undefined}
    //     // TODO calculate height?
    //     if (height > 512) {
    //         return <img id={id} src={url} alt="Image" css-width={calculatedWidth && `${calculatedWidth}px`}
    //                     css-height={height && `${height}px`} {...otherArgs}/>
    //     } else {
    //         return <img id={id} src={url} alt="Image" css-width={width && `${width}px`}
    //                     css-height={height && `${height}px`} {...otherArgs}/>
    //
    //     }
    // }
}

export const VideoFragment = ({ id, url = "", width = 0, height = 0, maxWidth = 470, maxHeight = 512, calculateSize = false, ...otherArgs }) => {
    if (!calculateSize) {
        if (url) {
            return <video id={id}
                  src={url}
                  {...otherArgs}/>

        } else {
            return <img id={id}
                    src={otherArgs.thumbUrl}
                    alt="Image"
                    {...otherArgs}/>
        }

    }

    const calculatedWidth = maxWidth === 0 ? width : Math.floor(Math.min(1, maxHeight / height) * width)
    const calculatedHeight = maxHeight === 0 ? height : Math.floor(Math.min(1, maxWidth / width) * height)

    if (url) {
        return <video id={id}
                  src={url}
                  css-width={calculatedWidth && `${calculatedWidth}px`}
                  css-height={calculatedHeight && `${calculatedHeight}px`}
                  {...otherArgs}/>
    } else {
        return <img id={id}
                src={otherArgs.thumbUrl}
                alt="Image"/>
    }
}