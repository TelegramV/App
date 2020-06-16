export const Section = ({title, ...otherArgs}, slot) => {
    console.log(otherArgs)
    return <section className="section" {...otherArgs}>
        {title ? <div className="title">{title}</div> : ""}
        {slot}
    </section>
}