import "../sass/application.scss"

import MTProto from "./MTProto/external"
import AppCache from "./Api/Cache/AppCache"

import VApp from "./vapp"
import AppRoutes from "./Ui/Routing"
import RippleVRDOMPlugin from "./Ui/Plugins/RipplePlugin"
import EmojiVRDOMPlugin from "./Ui/Plugins/EmojiPlugin"

import "./globals"

if (__IS_PRODUCTION__) {
    AppCache.open()
}

import("lottie-web").then(Module => {
    global.lottie = Module.default

    VApp.registerPlugin(RippleVRDOMPlugin)
    VApp.registerPlugin(EmojiVRDOMPlugin)
    VApp.useRoutes(AppRoutes)
    VApp.mount("#app")

    MTProto.connect()
})

// import {loadSchema, xSchema} from "./MTProto/language/schema"
// import TL from "./MTProto/language/TL"
//
// const inputMediaGeoLive = {
//     _: "inputMediaGeoLive",
//     stopped: false,
//     geo_point: {
//         _: "inputGeoPointEmpty"
//     },
//     period: 69
// }
//
// const inputMediaContact = {
//     _: "inputMediaContact",
//     phone_number: "01010101",
//     first_name: "AAaaAA",
//     last_name: "БбБбБї",
//     vcard: "WCard",
// }
//
// const inputMediaUploadedPhoto = {
//     _: "inputMediaUploadedPhoto",
//     file: {
//         _: "inputFileBig",
//         id: "112",
//         parts: 2,
//         name: "xxx",
//     },
//     ttl_seconds: 10,
//     stickers: [
//         {
//             _: "inputDocumentEmpty",
//         },
//         {
//             _: "inputDocumentEmpty",
//         },
//     ],
// }
//
// const X = {
//     exclude_pinned: false,
//     folder_id: 0,
//     offset_date: 0,
//     offset_id: -1,
//     offset_peer: {
//         _: "inputPeerEmpty",
//     },
//     limit: 20,
//     hash: ""
// }
//
// loadSchema().then(() => {
//     const InputMedia = inputMediaUploadedPhoto
//
//     const sx = TL.pack(InputMedia, "InputMedia")
//
//     const dxl = TL.unpack(sx.buffer)
//
//     console.log(dxl)
// })
