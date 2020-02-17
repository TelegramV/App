import LoginComponent from "./components/LoginComponent"
import {ModalComponent} from "../../modalManager";

/*function successfulAuth() {
    if (!keepLogged) {

        window.addEventListener("beforeunload", function (e) {
            AppPermanentStorage.clear() // tODO move this to proper place
        }, false);
    }
}


function initModals() {
    Array.from(document.querySelectorAll(".modal")).forEach(function (element) {
        element.addEventListener("click", function (e) {
            if (e.target == e.currentTarget) {
                hideModal();
            }
        });
        element.querySelector(".close-button").addEventListener("click", hideModal);
    });
}

function showModal(modal) {
    modal.classList.remove("hidden");
}

function hideModal() {
    Array.from(document.querySelectorAll(".modal:not(.hidden)")).forEach(function (element) {
        element.classList.add("hidden");
    });
}*/

const LoginPage = () => {
    return (
        <div>
            <ModalComponent/>
            <LoginComponent/>
        </div>
    )
}

export default LoginPage;