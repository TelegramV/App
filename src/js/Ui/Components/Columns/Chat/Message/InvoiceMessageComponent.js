import MessageWrapperFragment from "./Common/MessageWrapperFragment"
import GeneralMessageComponent from "./Common/GeneralMessageComponent"

class InvoiceMessageComponent extends GeneralMessageComponent {

    render({showDate}) {
        return (
            <MessageWrapperFragment message={this.props.message} showUsername={false} bubbleRef={this.bubbleRef} showDate={showDate}>
                This app currently is not supporting <b>Invoices</b>. Try using another app.
            </MessageWrapperFragment>
        )
    }
}

export default InvoiceMessageComponent;