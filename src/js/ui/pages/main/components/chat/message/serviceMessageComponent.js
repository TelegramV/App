const ServiceMessageComponent = ({message}) => {
    return (
        <div className="service">
            <div className="service-msg">Service Message [{message.action._}] {JSON.stringify(message.action)}</div>
        </div>
    )
}

export default ServiceMessageComponent