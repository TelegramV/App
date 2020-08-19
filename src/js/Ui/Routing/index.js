// import LoginPage from "../Pages/Login/LoginPage"
// import {MainPage} from "../Pages/Main/MainPage"
import MTProto from "../../MTProto/External"
import VApp from "../../V/vapp"
import {ConfigurableExample} from "../Components/AnotherVirtualList"
import {MainPage} from "../Pages/Main/MainPage"
import LoginPage from "../Pages/Login/LoginPage";
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

    router.route("/virt", "main", {
        h() {
            const MyList = ({
                                virtual,
                                itemHeight,
                            }) => (
                <ul className="media-list list-group" style={virtual.style}>
                    {virtual.items.map((item) => (
                        <li key={`item${item.id}`} className="list-group-item" style={{height: itemHeight + 'px'}}>
                            <div className="media-left">
                                <img className="media-object"
                                     src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PGRlZnMvPjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjEzLjQ2ODc1IiB5PSIzMiIgc3R5bGU9ImZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMHB0O2RvbWluYW50LWJhc2VsaW5lOmNlbnRyYWwiPjY0eDY0PC90ZXh0PjwvZz48L3N2Zz4="/>
                            </div>
                            <div className="media-body">
                                <h4 className="media-heading">{item.title}</h4>
                                <p>{item.text}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            );

            const MyConfigurableExample = ConfigurableExample(MyList);

            return <div id="app">
                <MyConfigurableExample/>
            </div>
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