import LoginPage from "../Pages/Login/LoginPage"
import {MainPage} from "../Pages/Main/MainPage"
import MTProto from "../../MTProto/External"
import {NewComponentPage} from "../Pages/Tests/NewComponentTestPage"
import {ReactListPage} from "../Pages/Tests/ReactiveListPage"
import VApp from "../../V/vapp"
import VirtualPage from "../Pages/Tests/VirtualPage"
import ElementsPage from "../Pages/Tests/Elements"
import ColumnsPage from "../Pages/Tests/Columns"
import CryptoTestPage from "../Pages/Tests/Crypto"
import {SpinnerTestPage} from "../Pages/Tests/SpinnerTestPage";
import NextGenPage from "../Pages/Tests/NextGen"

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

    if(!__IS_PRODUCTION__) {
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

        router.route("/spinner", "spinner", {
            h() {
                return SpinnerTestPage()
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
    }

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