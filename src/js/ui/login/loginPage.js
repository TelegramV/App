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

export const code2FAForm = `
<label for="code2FAInput">2FA code</label>
<input name="phone" id="code2FAInput">
<button id="loginSendCode2FAButton">Sign In</button>
`

export const signUpForm = `
<label for="signUpFirstName">First name</label>
<input name="phone" id="signUpFirstName">
<label for="signUpLastName">Last name</label>
<input name="phone" id="signUpLastName">
<button id="signUpButton">Sign Up</button>
`

export function setPhoneForm() {
    app.innerHTML = phoneForm
}

export function setCodeForm() {
    app.innerHTML = codeForm
}

export function setSignUpForm() {
    app.innerHTML = signUpForm
}

export function setCode2FAForm() {
    app.innerHTML = code2FAForm
}