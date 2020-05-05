/*
 * Telegram V
 * Copyright (C) 2020 original authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import AppConfiguration from "../../Config/AppConfiguration"

export let schema = null
export let xSchema = null

export function getMethodById(id) {
    return schema.methods[schema.indexes.methods.ids[id]]
}

export function getMethodByName(name) {
    return schema.methods[schema.indexes.methods.names[name]]
}

export function getConstructorById(id) {
    return schema.constructors[schema.indexes.constructors.ids[id]]
}

export function getConstructorByType(type) {
    return schema.constructors[schema.indexes.constructors.types[type]]
}

export function getConstructorByPredicate(predicate) {
    return schema.constructors[schema.indexes.constructors.predicates[predicate]]
}

function x(arrayBuffer) {
    let byteOffset = 0
    const dv = new DataView(arrayBuffer)

    const readString = () => {
        const len = dv.getUint8(byteOffset)
        byteOffset += 1
        const sa = new Uint8Array(arrayBuffer).subarray(byteOffset, byteOffset + len)
        byteOffset += len
        return new TextDecoder("ascii").decode(sa)
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
    xSchema = k
}

export function loadSchema() {
    return new Promise(resolve => {
        // console.time("schema")
        const xhr = new XMLHttpRequest()
        xhr.responseType = "arraybuffer";

        xhr.open("GET", `static/schema${AppConfiguration.mtproto.api.layer}.dat`)
        xhr.onload = function () {
            // console.timeLog("schema")
            const arrayBuffer = xhr.response; // Note: not oReq.responseText
            if (arrayBuffer) {
                x(arrayBuffer)

                schema.indexes = {
                    constructors: {
                        ids: {},
                        types: {},
                        predicates: {},
                    },
                    methods: {
                        ids: {},
                        names: {},
                    },
                }

                for (let i = 0; i < schema.constructors.length; i++) {
                    const {id, type, predicate} = schema.constructors[i]
                    schema.indexes.constructors.ids[id] = i
                    schema.indexes.constructors.types[type] = i
                    schema.indexes.constructors.predicates[predicate] = i
                }

                for (let i = 0; i < schema.methods.length; i++) {
                    const {id, method} = schema.methods[i]
                    schema.indexes.methods.ids[id] = i
                    schema.indexes.methods.names[method] = i
                }

                resolve(xSchema)
            }
        };

        xhr.send(null);
    })
}
