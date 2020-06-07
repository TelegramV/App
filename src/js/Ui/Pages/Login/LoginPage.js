import LoginComponent from "../../Components/Login/LoginComponent"
import {ModalComponent} from "../../Components/Singleton/ModalComponent";

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