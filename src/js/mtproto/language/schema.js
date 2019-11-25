import Bytes from "../utils/bytes"

export let schema = null

export function loadSchema() {
    return new Promise(resolve => {
        console.time("schema")
        const xhr = new XMLHttpRequest()
        xhr.responseType = "arraybuffer";

        xhr.open("GET", "static/schema.dat")
        xhr.onload = function (oEvent) {
            console.timeLog("schema")
            const arrayBuffer = xhr.response; // Note: not oReq.responseText
            if (arrayBuffer) {
                let byteOffset = 0
                const dv = new DataView(arrayBuffer)

                const readString = () => {
                    const len = dv.getUint8(byteOffset)
                    byteOffset += 1
                    const sa = new Uint8Array(arrayBuffer).subarray(byteOffset, byteOffset + len)
                    byteOffset += len
                    return atob(Bytes.asBase64(sa))
                }

                const k = {
                    constructors: [],
                    methods: []
                }
                const c_len = dv.getUint32(byteOffset, true)
                byteOffset += 4

                for (let i = 0; i < c_len; i++) {
                    const obj = {}
                    obj.id = dv.getUint32(byteOffset, true)
                    byteOffset += 4

                    obj.predicate = readString()
                    obj.type = readString()
                    const p_len = dv.getUint8(byteOffset)
                    byteOffset += 1
                    obj.params = []
                    for (let j = 0; j < p_len; j++) {
                        obj.params.push({
                            name: readString(),
                            type: readString()
                        })
                    }
                    k.constructors.push(obj)
                }


                const m_len = dv.getUint32(byteOffset, true)
                byteOffset += 4

                for (let i = 0; i < m_len; i++) {
                    const obj = {}
                    obj.id = dv.getUint32(byteOffset, true)
                    byteOffset += 4

                    obj.method = readString()
                    obj.type = readString()
                    const p_len = dv.getUint8(byteOffset)
                    byteOffset += 1
                    obj.params = []
                    for (let j = 0; j < p_len; j++) {
                        obj.params.push({
                            name: readString(),
                            type: readString()
                        })
                    }
                    k.methods.push(obj)
                }

                schema = k
                console.timeEnd("schema")
                resolve(schema)
            }
        };

        xhr.send(null);
    })
}
