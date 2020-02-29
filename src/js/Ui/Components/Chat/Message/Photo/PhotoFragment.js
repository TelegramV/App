export const PhotoFragment = ({id, url = "", thumb = true, width = 0, height = 0, maxWidth = 0, maxHeight = 0}) => {
    const calculatedWidth = Math.min(1, maxHeight / height) * width
    const calculatedHeight = Math.min(1, maxWidth / width) * height

    if (width >= height) {
        if (width >= 470) {
            return <img id={id} src={url} alt="Image" css-width={width ? `${width}px` : undefined}
                        css-height={calculatedHeight ? `${calculatedHeight}px` : undefined}/>
        } else {
            return <img id={id} src={url} alt="Image" css-width={width ? `${width}px` : undefined}
                        css-height={height ? `${height}px` : undefined}/>
        }
    } else { // height={height ? `${height}px` : undefined}
        // TODO calculate height?
        if (height > 512) {
            return <img id={id} src={url} alt="Image" css-width={calculatedWidth ? `${calculatedWidth}px` : undefined}
                        css-height={height ? `${height}px` : undefined}/>
        } else {
            return <img id={id} src={url} alt="Image" css-width={width ? `${width}px` : undefined}
                        css-height={height ? `${height}px` : undefined}/>

        }
    }
}