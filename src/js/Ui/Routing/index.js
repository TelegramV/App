import LoginPage from "../Pages/Login/LoginPage"
import {MainPage} from "../Pages/Main/MainPage"
import MTProto from "../../MTProto/external"
import VF from "../../V/VFramework"
import {NewComponentPage} from "../Pages/Tests/NewComponentTestPage"
import {ReactListPage} from "../Pages/Tests/ReactiveListPage"

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