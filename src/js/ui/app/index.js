import {phoneForm} from "../login/loginPage";

const app = document.getElementById("app")

export const chatsList = `
<label for="loginPhoneNumberInput">Phone</label>
<input name="phone" id="loginPhoneNumberInput" value="9996601488">
<button id="loginSendPhoneButton">Send Code</button>
`

export function setApp() {
    app.innerHTML = app
}