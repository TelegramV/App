import MessageWrapperFragment from "./common/MessageWrapperFragment"
import GeneralMessageComponent from "./common/GeneralMessageComponent"

class InvoiceMessageComponent extends GeneralMessageComponent {

    h() {
        return (
            <MessageWrapperFragment message={this.message} showUsername={false}>
                This app currently is not supporting <b>Invoices</b>. Try using another app.
            </MessageWrapperFragment>
        )
    }
}

export default InvoiceMessageComponent;