import classIf from "../../../../V/VRDOM/jsx/helpers/classIf";

function Subheader({isLoading}, slot) {
    return <div className={["subheader", classIf(isLoading, "loading-text")]}>
        {slot}
    </div>
}

export default Subheader