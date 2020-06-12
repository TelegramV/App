import LoginPageComponent from "./LoginPageComponent"
import ModalContainer from "../../Components/Singleton/ModalContainer"

const LoginPage = () => {
    document.querySelector("body").classList.add("scrollable"); //TODO better fix

    return (
        <div>
            <ModalContainer/>
            <LoginPageComponent/>
        </div>
    )
}

export default LoginPage;