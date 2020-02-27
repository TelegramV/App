import {PhotoComponent} from "../../../../basic/photoComponent"

export const DialogInfoLinkComponent = ({title, description, url, photo, displayUrl, letter}) => {
    return <a className="link rp" href={url} target="_blank">
        {
            photo ?
                <PhotoComponent photo={photo}/>
                :
                <div className="photo letter">{letter}</div>
        }
        <div className="details">
            <span className="title">{title}</span>
            <span className="description">{description}</span>
            <a className="url">{displayUrl}</a>
        </div>
    </a>
}