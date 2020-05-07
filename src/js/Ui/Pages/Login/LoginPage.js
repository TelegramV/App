import LoginComponent from "../../Components/Login/LoginComponent"
import {ModalComponent} from "../../Components/Singleton/ModalComponent";
import VPage from "../../../V/Router/VPage"

class VLoginPage extends VPage {

    name = "login-page"

    render() {
        return (
            <div>
                <ModalComponent/>
                <LoginComponent/>
            </div>
        )
    }
}

const LoginPage = () => {
	document.querySelector("body").classList.add("scrollable"); //TODO better fix
    return (
        <div>
            <ModalComponent/>
            <LoginComponent/>
        </div>
    )
}

export default LoginPage;