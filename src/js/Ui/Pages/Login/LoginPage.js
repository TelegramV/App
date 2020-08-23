import LoginPageComponent from "./LoginPageComponent"
import ModalContainer from "../../Components/Singleton/ModalContainer"
import LanguageModal from "./LanguageModal"
import VUI from "../../VUI"

const LoginPage = () => {
    document.querySelector("body").classList.add("scrollable"); //TODO better fix

    return (
        <div>
        	<div class="login-header">
        		<div class="lng-button rp" onClick={() => VUI.Modal.open(<LanguageModal/>)}>
        			<i class="tgico tgico-language"/>
        		</div>
        	</div>
            <ModalContainer/>
            <LoginPageComponent/>
        </div>
    )
}

export default LoginPage;