import LoginPage from "../pages/login/nextlogin"
import {MainPage} from "../pages/main/mainPage"
import MTProto from "../../mtproto/external"
import V from "../v/VFramework"
import {NewComponentPage} from "../pages/tests/NewComponentTestPage"

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

    router.middleware(toRoute => {
        if (!MTProto.isUserAuthorized()) {
            if (toRoute.route.name !== "login") {
                return {
                    next: false,
                    doNext: () => {
                        V.router.replace("/login")
                    },
                }
            }
        } else {
            if (toRoute.route.name === "login") {
                return {
                    next: false,
                    doNext: () => {
                        V.router.replace("/")
                    }
                }
            }
        }

        return true
    })
}

export default AppRoutes