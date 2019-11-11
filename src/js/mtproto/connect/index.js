import {sendReqPQ} from "./methods"

export default function (authContext, processor, proc_context) {
    return sendReqPQ(authContext, processor, proc_context)
}