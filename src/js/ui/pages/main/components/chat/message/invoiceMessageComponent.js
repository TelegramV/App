import MessageWrapperComponent from "./messageWrapperComponent"
const InvoiceMessageComponent = ({message}) => {
	return (
		<MessageWrapperComponent message={message}>
			This app currently is not supporting <b>Invoices</b>. Try using another app.
		</MessageWrapperComponent>
		)
}

export default InvoiceMessageComponent;