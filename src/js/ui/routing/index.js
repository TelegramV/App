import {LoginPage} from "../pages/login/nextlogin"
import {MainPage} from "../pages/main/mainPage"
import MTProto from "../../mtproto"
import AppFramework from "../framework/framework"

/**
 * @param {FrameworkRouter} router
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

    router.middleware(toRoute => {
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
}

export default AppRoutes