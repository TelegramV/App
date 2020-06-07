// @flow

import {AbstractMessage} from "../AbstractMessage"
import {MessageType} from "../Message"

export class InvoiceMessage extends AbstractMessage {

    type = MessageType.INVOICE
}