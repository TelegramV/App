import MessageWrapperComponent from "./messageWrapperComponent"
const InvoiceMessageComponent = ({message}) => {
	return (
		<MessageWrapperComponent message={message}>
			<div class="message">
				This app currently is not supporting <b>Invoices</b>. Try using another app.
			</div>
		</MessageWrapperComponent>
		)
}

export default InvoiceMessageComponent;