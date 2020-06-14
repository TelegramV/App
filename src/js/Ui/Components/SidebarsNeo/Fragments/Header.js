import classIf from "../../../../V/VRDOM/jsx/helpers/classIf";

function Header({isLoading}, slot) {
    return <div className={["header", classIf(isLoading, "loading-text")]}>
        {slot}
    </div>
}

export default Header