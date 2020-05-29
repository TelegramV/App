import Opus from "./Opus";

export default class NativeOpus extends Opus {
    // Not implemented :(
    get version(): string {
        return "nativeopus 1.1.2"
    }
}