import MessageWrapperComponent from "./common/MessageWrapperComponent"
import GeneralMessageComponent from "./common/GeneralMessageComponent"

class InvoiceMessageComponent extends GeneralMessageComponent {

    h() {
        return (
            <MessageWrapperComponent message={this.message}>
                This app currently is not supporting <b>Invoices</b>. Try using another app.
            </MessageWrapperComponent>
        )
    }
}

export default InvoiceMessageComponent;