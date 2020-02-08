import LoginPage from "../pages/login/nextlogin"
import {MainPage} from "../pages/main/mainPage"
import MTProto from "../../mtproto/external"
import VF from "../v/VFramework"
import {NewComponentPage} from "../pages/tests/NewComponentTestPage"
import {ReactListPage} from "../pages/tests/ReactiveListPage"

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

    router.middleware(toRoute => {
        if (!MTProto.isUserAuthorized()) {
            if (toRoute.route.name !== "login") {
                return {
                    next: false,
                    doNext: () => {
                        VF.router.replace("/login")
                    },
                }
            }
        } else {
            if (toRoute.route.name === "login") {
                return {
                    next: false,
                    doNext: () => {
                        VF.router.replace("/")
                    }
                }
            }
        }

        return true
    })
}

export default AppRoutes