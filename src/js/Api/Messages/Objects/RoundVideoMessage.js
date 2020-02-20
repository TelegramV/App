// @flow

import {VideoMessage} from "./VideoMessage"
import {MessageType} from "../Message"

export class RoundVideoMessage extends VideoMessage {

    type = MessageType.ROUND

}