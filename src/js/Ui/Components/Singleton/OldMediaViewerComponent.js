// /*
//  * Copyright 2020 Telegram V authors.
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  *
//  */
//
// import {PhotoMessage} from "../../../Api/Messages/Objects/PhotoMessage";
// import VComponent from "../../../V/VRDOM/component/VComponent";
// import UIEvents from "../../EventBus/UIEvents";
// import type {AE} from "../../../V/VRDOM/component/__component_registerAppEvents";
// import {AbstractMessage} from "../../../Api/Messages/AbstractMessage";
// import {VideoMessage} from "../../../Api/Messages/Objects/VideoMessage";
// import AvatarFragment from "../Basic/AvatarFragment";
// import {Photo} from "../../../Api/Media/Photo";
//
// const MediaFragment = ({media}) => {
//     if (media instanceof PhotoMessage) {
//         return <img src={media.srcUrl} alt=""/>
//     }
//     if (media instanceof VideoMessage) {
//         return <video controls src={media.videoUrl}/>
//     }
//     if (media instanceof Photo) {
//         return <img src={media.srcUrl} alt=""/>
//     }
//     return <div/>
// }
//
// const NavigationButtonFragment = ({isNext, hidden, onClick}) => {
//     return <div className={{
//         "navigation": true,
//         "prev": !isNext,
//         "topPage": isNext,
//         "tgico-up": true,
//         "rp": true,
//         "hidden": hidden
//     }} onClick={onClick}/>
// }
//
// export class MediaViewerComponent extends VComponent {
//
//     state = {
//         hidden: true,
//
//     }
//
//     appEvents(E: AE) {
//         E.bus(UIEvents.MediaViewer)
//             .on("showMessage", this.showMessage)
//             .on("showAvatar", this.showAvatar)
//     }
//
//     showMessage = (message) => {
//         if (message instanceof PhotoMessage && !message.loaded) {
//             message.fetchMax().then(l => this.forceUpdate())
//         }
//
//         this.setState({
//             hidden: false,
//             media: message,
//             from: message.from,
//             date: message.date,
//             caption: message.text
//         })
//     }
//
//     showAvatar = (event) => {
//         const peer = event.peer
//         // peer.photo.fetchBig().then(l => this.forceUpdate())
//
//         if (!peer._photos) {
//             peer.fetchPeerPhotos().then(l => {
//                 console.log(l)
//                 peer._photos[0].fetchMax().then(_ => {
//                     this.forceUpdate()
//                 })
//                 this.setState({
//                     hidden: false,
//                     media: peer._photos[0],
//                     from: peer,
//                     date: peer._photos[0].date,
//                     caption: "",
//                     currentPhoto: 0
//                 })
//             })
//         } else {
//             this.setState({
//                 hidden: false,
//                 media: peer._photos[0],
//                 from: peer,
//                 date: peer._photos[0].date,
//                 caption: "",
//                 currentPhoto: 0
//             })
//         }
//         // console.log(peer.full)
//         // this.setState({
//         //     hidden: false,
//         //     // media: peer.photo,
//         //     // from: peer,
//         //     // date: peer.full?.profile_photo.date,
//         //     // caption: ""
//         // })
//     }
//
//     getNextOrPrev(topPage = true) {
//         if (this.state.media instanceof AbstractMessage) {
//             const peer = this.state.media.to
//             const filtered = Array.from(peer.messages.messages, ([key, value]) => value).filter(l => {
//                 return (topPage ? (l.id > this.state.media.id) : (l.id < this.state.media.id)) && l.isDisplayedInMediaViewer
//             })
//             if (filtered.length === 0) return null
//
//             return filtered.reduce((l, q) => {
//                 return (topPage ? l.id < q.id : l.id > q.id) ? l : q
//             })
//         } else if (this.state.media instanceof Photo) {
//             const peer = this.state.media.peer
//             if (!peer._photos) {
//                 return null
//             }
//             const q = (topPage ? this.state.currentPhoto + 1 : this.state.currentPhoto - 1)
//             if (q >= peer._photos.length || q < 0) return null
//             return peer._photos[q]
//         } else {
//             return null
//         }
//     }
//
//     hasNext = () => {
//         return !!this.getNextOrPrev(true)
//     }
//
//     hasPrev = () => {
//         return !!this.getNextOrPrev(false)
//     }
//
//     topPage = (ev) => {
//         ev.stopPropagation()
//         const n = this.getNextOrPrev(true)
//         if (n) {
//             if (n instanceof Photo) {
//                 if (!n.loaded) n.fetchMax().then(_ => this.forceUpdate())
//                 this.setState({
//                     hidden: false,
//                     media: n,
//                     from: n.peer,
//                     date: n.date,
//                     caption: "",
//                     currentPhoto: this.state.currentPhoto + 1
//                 })
//             } else {
//                 this.showMessage(n)
//             }
//         }
//     }
//
//     prev = (ev) => {
//         ev.stopPropagation()
//         const n = this.getNextOrPrev(false)
//         if (n) {
//
//             if (n instanceof Photo) {
//                 if (!n.loaded) n.fetchMax().then(_ => this.forceUpdate())
//                 this.setState({
//                     hidden: false,
//                     media: n,
//                     from: n.peer,
//                     date: n.date,
//                     caption: "",
//                     currentPhoto: this.state.currentPhoto - 1
//                 })
//             } else {
//                 this.showMessage(n)
//             }
//         }
//     }
//
//     formatDate() {
//         return new Date(this.state.date * 1000).toLocaleString("en", {
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: false
//         })
//     }
//
//     render() {
//         return (
//             <div className={["media-viewer-wrapper", this.state.hidden ? "hidden" : ""]}>
//                 <div className="media-viewer" onClick={this.close}>
//                     <div className="header">
//                         <div className="left">
//                             <AvatarFragment peer={this.state.from}/>
//                             <div className="text">
//                                 <div className="name">{this.state.from?.name}</div>
//                                 <div className="time">{this.formatDate()}</div>
//                             </div>
//                         </div>
//                         <div className="right">
//                             <i className="tgico tgico-delete rp rps"/>
//                             <i className="tgico tgico-forward rp rps"/>
//                             <i className="tgico tgico-download rp rps"/>
//                             <i className="tgico tgico-close rp rps"/>
//                         </div>
//                     </div>
//                     <div className="media">
//                         <NavigationButtonFragment onClick={this.prev} hidden={!this.hasPrev()}/>
//                         <MediaFragment media={this.state.media}/>
//                         <NavigationButtonFragment onClick={this.topPage} isNext hidden={!this.hasNext()}/>
//                     </div>
//                     <div className="caption">{this.state.caption}</div>
//                 </div>
//             </div>
//         )
//     }
//
//     close = () => {
//         this.setState({
//             hidden: true,
//             media: null,
//             from: null,
//             date: null,
//             caption: null
//         })
//     }
//
//     open = (message) => {
//         if (message instanceof PhotoMessage && !message.loaded) {
//             message.fetchMax().then(l => this.forceUpdate())
//         }
//         this.setState({
//             hidden: false,
//             message: message
//         })
//     }
// }
//
// export default MediaViewerComponent