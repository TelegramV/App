import LoginPage from "../Pages/Login/LoginPage"
import {MainPage} from "../Pages/Main/MainPage"
import MTProto from "../../MTProto/External"
import VApp from "../../V/vapp"
//import {VideoStreamingPage} from "../Pages/Tests/VideoStreaming"
//import CalendarTestPage from "../Pages/Tests/CalendarTestPage"
//import VirtualPage from "../Pages/Tests/VirtualPage"
//import ElementsPage from "../Pages/Tests/Elements"
//import ColumnsPage from "../Pages/Tests/Columns"
//import CryptoTestPage from "../Pages/Tests/Crypto"
//import NextGenPage from "../Pages/Tests/NextGen"
//import {StreamingPage} from "../Pages/Tests/Streaming"
//import {SpinnerTestPage} from "../Pages/Tests/SpinnerTestPage"
//import ElementsPage from "../Pages/Tests/Elements"
//import CanvasTestPage from "../Pages/Tests/CanvasTest"

/**
 * @param {VFrameworkRouter} router
 */
function AppRoutes(router) {
    router.route("/login", "login", {
        h() {
            return LoginPage()
        }
    })

    router.route("/", "main", {
        h() {
            return MainPage()
        }
    })

    //router.route("/canvas", "canvas", {
    //    h() {
    //        return CanvasTestPage()
    //    }
    //})

    // router.route("/voicefuck", "voicefuck", {
    //     h() {
    //         return voicefuck()
    //     }
    // })

    // router.route("/videoplayer", "videoplayer", {
    //     h() {
    //         return VideoPlayerPage()
    //     }
    // })
    // router.route("/calendar", "calendar", {
    //     h() {
    //         return CalendarTestPage()
    //     }
    // })

    /*if (!__IS_PRODUCTION__) {
    // router.route("/fff", "fff", {
    //     h() {
    //         return FragmentsPage()
    //     }
    // })

    // router.route("/video", "video", {
    //     h() {
    //         return VideoStreamingPage()
    //     }
    // })

    // router.route("/spinner", "spinner", {
    //     h() {
    //         return SpinnerTestPage()
    //     }
    // })
    //
    // router.route("/elements", "elements", {
    //     h() {
    //         return ElementsPage()
    //     }
    // })
        router.route("/test", "test", {
            h() {
                return NewComponentPage()
            }
        })

        router.route("/reactlist", "test", {
            h() {
                return ReactListPage()
            }
        })

        router.route("/virtual-list", "virtual-list", {
            h() {
                return VirtualPage()
            }
        })

        router.route("/elements", "elements", {
            h() {
                return ElementsPage()
            }
        })

        router.route("/columns", "elements", {
            h() {
                return ColumnsPage()
            }
        })

        router.route("/crypto", "crypto", {
            h() {
                return CryptoTestPage()
            }
        })

        router.route("/nextgen", "crypto", {
            h() {
                return NextGenPage()
            }
        })

        router.route("/streaming", "crypto", {
            h() {
                return StreamingPage()
            }
        })

        // router.route("/reactcalc", "crypto", {
        //     h() {
        //         return calculatorpage()
        //     }
        // })
    }*/

    router.middleware(toRoute => {
        if (!MTProto.isUserAuthorized()) {
            if (toRoute.route.name !== "login") {
                return {
                    next: false,
                    doNext: () => {
                        VApp.router.replace("/login")
                    },
                }
            }
        } else {
            if (toRoute.route.name === "login") {
                return {
                    next: false,
                    doNext: () => {
                        VApp.router.replace("/")
                    }
                }
            }
        }

        return true
    })
}

export default AppRoutes