import {MTProto} from "./mtproto"
import {createNonce} from "./mtproto/utils/bin"

import "../sass/application.scss"
import {MainPage} from "./ui/pages/main/mainPage"
import {LoginPage} from "./ui/pages/login/nextlogin"
import {AppFramework} from "./ui/framework/framework"

import "./ui/vendor/tgs_player"
import {EventBus} from "./api/eventBus"
import ReactiveCallback from "./ui/framework/reactive/reactiveCallback"
import {loadSchema} from "./mtproto/language/schema"


const authContext = {
    dcID: 2,
    nonce: createNonce(16),
    sessionID: createNonce(8) // TODO check if secure?
}

function start() {
    MTProto.invokeMethod("help.getNearestDc", {}).then(response => {
        if (response.this_dc !== response.nearest_dc) {
            MTProto.changeDefaultDC(response.nearest_dc)
            // TODO country response.contry
        }
    })

    global.UIEventBus = new EventBus()

    AppFramework.Router.route("/login", "login", {
        h() {
            return LoginPage()
        }
    })

    AppFramework.Router.route("/", "main", {
        h() {
            return MainPage()
        }
    })

    AppFramework.Router.middleware(toRoute => {
        if (!MTProto.isUserAuthorized()) {
            if (toRoute.route.name !== "login") {
                return {
                    next: false,
                    doNext: () => {
                        AppFramework.Router.push("/login")
                    },
                }
            }
        } else {
            if (toRoute.route.name === "login") {
                return {
                    next: false,
                    doNext: () => {
                        AppFramework.Router.push("/")
                    }
                }
            }
        }

        return true
    })

    AppFramework.mount("#app")
}

// const selectedDialogListeners = []
//
// const SelectedDialog = ReactiveCallback(resolve => {
//     selectedDialogListeners.push(resolve)
// })

// AppFramework.Router.route("/", "main", {
//     h() {
//         const NestedComponent = {
//             name: "nested",
//             state: {
//                 count: 0
//             },
//             props: {},
//             h() {
//                 return (
//                     <h1>
//                         {this.state.count} | {this.props.get("combo")}
//                     </h1>
//                 )
//             },
//             mounted() {
//                 console.log("nested mounted")
//             },
//             created() {
//                 console.log("nested created")
//             },
//             updated() {
//                 console.log("nested updated")
//             },
//             destroy() {
//                 console.log("nested destroy")
//             },
//             patchRequest(vNode) {
//                 console.log("nested patchRequest", vNode)
//             },
//         }
//
//         const Component = {
//             name: "component",
//             state: {
//                 query: UpdatedQuery
//             },
//             h() {
//                 return (
//                     <div>
//                         {AppFramework.Router.activeRoute.queryParams}
//                         {this.state.query ? this.state.query.q : "q"}
//
//                         {this.state.query ? <NestedComponent combo={this.state.query.q}/> : <NestedComponent/>}
//                     </div>
//                 )
//             }
//         }
//
//         return VDOM.render(
//             <div>
//                 <Component/>
//             </div>
//         )
//     }
// })


// AppFramework.mount("#app")

loadSchema().then(() => MTProto.connect(authContext).then(start))