export const Section = ({title, ...otherArgs}, slot) => {
    return <section className="section" {...otherArgs}>
        {title ? <div className="title">{title}</div> : ""}
        {slot}
    </section>
}