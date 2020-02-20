import {PhotoComponent} from "../../../../basic/photoComponent"

export const DialogInfoAudioComponent = ({title, description, time}) => {
    return <div className="audio rp">
        <div className="play tgico tgico-play"/>
        <div className="details">
            <span className="title">{title}</span>
            <span className="description">{description}</span>
            <span className="time">{time}</span>
        </div>
    </div>
}