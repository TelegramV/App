import MessageWrapperFragment from "./Common/MessageWrapperFragment";
import GeneralMessageComponent from "./Common/GeneralMessageComponent";

class InvoiceMessageComponent extends GeneralMessageComponent {

    render({showDate}) {
        return (
            MessageWrapperFragment(
                {message, showDate, showUsername: false},
                <>
                    This app currently is not supporting <b>Invoices</b>. Try using another app.
                </>
            )
        );
    }
}

export default InvoiceMessageComponent;