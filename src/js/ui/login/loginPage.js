const app = document.getElementById("app")

export const phoneForm = `
<label for="loginPhoneNumberInput">Phone</label>
<input name="phone" id="loginPhoneNumberInput" value="9996601488">
<button id="loginSendPhoneButton">Send Code</button>
`

export const codeForm = `
<label for="loginCodeInput">Code</label>
<input name="phone" id="loginCodeInput">
<button id="loginSendCodeButton">Sign In</button>
`

export function setPhoneForm() {
    app.innerHTML = phoneForm
}

export function setCodeForm() {
    app.innerHTML = codeForm
}