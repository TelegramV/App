import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent";

export class OnTopConsole extends StatelessComponent {
    enabled = true
    render() {
        return (
            <div style={{
                "position": "absolute",
                "z-index": "10000000",
                "width": "100%",
                "height": "100%",
                "pointer-events": "none"
            }}>

                <div style={{
                    "position": "absolute",
                    "width": "25px",
                    "height": "25px",
                    "background": "black",
                    "bottom": "0",
                    "right": "0",
                    "z-index": "10000000000",                "pointer-events": "auto"

                }} onClick={this.switch}/>
                <div id="cc" style={{
                    "position": "absolute",
                    "width": "100%",
                    "display": "flex",
                    "flex-direction": "column-reverse",
                    "color": "rgba(0, 0, 0, 1)",
                    "opacity": "0.5",
                    "pointer-events": "none",
                    "user-select": "none"
                }}>

                </div>
            </div>

        );
    }

    init() {
        this.realLog = console.log
        this.realError = console.error
        this.realWarn = console.warn
        console.log = this.log
        console.error = this.error
        console.warn = this.warn
    }

    switch = () => {
        this.enabled = !this.enabled
        if(this.enabled) {
            this.$el.querySelector("#cc").style.background = "white"
            this.$el.querySelector("#cc").style.opacity = "0.9"
            this.$el.querySelector("#cc").style.pointerEvents = "auto"
        } else {
            this.$el.querySelector("#cc").style.background = "transparent"
            this.$el.querySelector("#cc").style.opacity = "0.5"
            this.$el.querySelector("#cc").style.pointerEvents = "none"

        }
    }

    log = (...data) => {
        this.realLog(...data)
        const $text = document.createElement("div")
        $text.innerHTML = data
        this.$el.querySelector("#cc").appendChild($text)
    }

    error = (...data) => {
        this.realError(...data)

        const $text = document.createElement("div")
        $text.innerHTML = data
        $text.style.color = "rgba(255, 0, 0, 1)"
        this.$el.querySelector("#cc").appendChild($text)
    }

    warn = (...data) => {
        this.realWarn(...data)

        const $text = document.createElement("div")
        $text.innerHTML = data
        $text.style.color = "rgba(255,225,0,1)"
        this.$el.querySelector("#cc").appendChild($text)
    }
}