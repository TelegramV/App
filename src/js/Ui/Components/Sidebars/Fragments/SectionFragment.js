export const SectionFragment = ({title, noBorders}, slot) => {
    return <div className={{
        "section": true,
        "no-borders": noBorders
    }}>
        {title ? <div className="title">{title}</div> : ""}
        {slot}
    </div>
}