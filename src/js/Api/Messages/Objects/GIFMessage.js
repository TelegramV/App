// @flow

import {MessageType} from "../Message"
import {VideoMessage} from "./VideoMessage"

export class GIFMessage extends VideoMessage {

    type = MessageType.GIF
}