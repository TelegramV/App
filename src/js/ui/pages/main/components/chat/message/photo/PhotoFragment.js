export const PhotoFragment = ({id, url = "", thumb = true, width = 0, height = 0}) => {
    if (!thumb) {
        return <img id={id} src={url} alt="Image"/>
    } else if (width > height) {
        return <img id={id} src={url} alt="Image" width={width ? `${width}px` : ""}/>
    } else {
        return <img id={id} src={url} alt="Image" height={height ? `${height}px` : ""}/>
    }
}