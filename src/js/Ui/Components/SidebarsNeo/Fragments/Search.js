import VSimpleLazyInput from "../../../Elements/Input/VSimpleLazyInput";

function Search({onInput, onFocus, lazyLevel, r, value, placeholder = "Search"}, slot) {
    return <div className="input-search">
        <VSimpleLazyInput type="text" placeholder={placeholder}
                          ref={r}
                          onInput={event => {
                              onInput(event)
                              event.target.parentNode.querySelector(".tgico-close").classList.toggle("hidden", event.target.value.length === 0)
                          }
                          }
                          onFocus={onFocus}
                          lazyLevel={lazyLevel}
                          value={value}/>
        <span className="tgico tgico-search"/>
        <div className="tgico tgico-close rp rps hidden" onClick={event => {
            event.target.parentNode.querySelector("input").value = ""
            onInput({
                target: event.target.parentNode.querySelector("input")
            })
            event.target.classList.add("hidden")
        }}/>
    </div>
}

export default Search