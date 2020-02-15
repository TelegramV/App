import {Zlib} from "../vendor/zlib"

export function GZIP_UNCOMPRESS(bytes) {
    return (new Zlib.Gunzip(bytes)).decompress()
}