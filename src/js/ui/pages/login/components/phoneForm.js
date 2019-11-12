export function loginPageSetPhoneForm(options = {}) {
    return `
        <form>
            <label for="phoneNumberInput">Phone</label>
            <input type="number" id="phoneNumberInput" value="9996621488" autofocus>
            
            <button id="sendCodeButton">Next</button>
        </form>
    `
}