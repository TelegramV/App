import "../sass/application.scss"

import "./ui/vendor/tgs_player"
import AppFramework from "./ui/framework/framework"
import MTProto from "./mtproto"
import {MainPage} from "./ui/pages/main/mainPage"
import {LoginPage} from "./ui/pages/login/nextlogin"
import ReactiveCallback from "./ui/framework/reactive/reactiveCallback"
import Component from "./ui/framework/vrdom/component"
import AppCache from "./api/cache"
import {loadSchema} from "./mtproto/language/schema"
import PeersStore from "./api/store/peersStore"
import AppEvents from "./api/eventBus/appEvents"
import {createNonce} from "./mtproto/utils/bin";

const isProduction = false

const authContext = {
    dcID: 2,
    nonce: createNonce(16),
    sessionID: createNonce(8)
}

function start() {
    MTProto.invokeMethod("help.getNearestDc", {}).then(response => {
        if (response.this_dc !== response.nearest_dc) {
            MTProto.changeDefaultDC(response.nearest_dc)
            // TODO country response.country
        }
    })

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

const _selectListeners = []

AppFramework.Router.onQueryChange(queryParams => {
    _selectListeners.forEach(listener => {
        listener(AppFramework.Router.activeRoute.queryParams)
    })
})

const ReactiveQuery = ReactiveCallback(resolve => {
    _selectListeners.push(resolve)
    return AppFramework.Router.activeRoute.queryParams
}, resolve => {
    const index = _selectListeners.findIndex(value => value === resolve)

    if (index > -1) {
        _selectListeners.splice(index, 1)
    } else {
        console.error("cannot find resolve")
    }
})


const DateComponent = ({date}) => <b>{date}</b>

class Y extends Component {
    constructor() {
        super();

        this.state = {
            count: 0
        }
    }

    h() {
        return (
            <h1 onClick={this._click}>
                Component {this.state.count}
                Query {this.reactive.q}
                <br/>
                <DateComponent date={new Date()}/>
            </h1>
        )
    }

    created() {
        console.log("X created")
    }

    mounted() {
        console.log("X mounted")
    }

    destroy() {
        console.log("X destroying")
    }

    _click() {
        console.log("clicked", this)
        this.state.count++
        this.__patch()
    }
}

class Parent extends Component {
    constructor() {
        super();

        this.reactive = {
            q: ReactiveQuery.Default
        }
    }

    h() {
        return (
            <div>
                <div>1<Y ref="Parent"/><Y/></div>
                <br/>
                {this.reactive.q}

                <br/>
                <br/>

                <div>TEXT<i></i></div>

                <hr/>


                {this.refs.get("Parent")}
            </div>
        )
    }

    reactiveChanged(key, value) {
        console.log("changed", key, value, this)
    }

    created() {
        console.log("Parent created")
    }

    mounted() {
        console.log("Parent mounted")
    }

    destroy() {
        console.log("Parent destroying")
    }
}

// AppFramework.Router.route("/", "main", {
//     h() {
//         return <div><Parent/></div>
//     }
// })
//
// AppFramework.mount("#app")


global.Peers = PeersStore
global.EVE = AppEvents

if (isProduction) {
    AppCache.open()
}


loadSchema().then(() => MTProto.connect(authContext).then(start))