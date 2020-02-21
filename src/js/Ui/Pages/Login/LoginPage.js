import LoginComponent from "../../Components/Login/LoginComponent"
import {ModalComponent} from "../../Fuck/modalManager";
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
    return (
        <div>
            <ModalComponent/>
            <LoginComponent/>
        </div>
    )
}

export default LoginPage;