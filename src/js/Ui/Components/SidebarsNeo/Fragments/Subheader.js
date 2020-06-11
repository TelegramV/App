import classIf from "../../../../V/VRDOM/jsx/helpers/classIf";

function Subheader({isLoading, isOnline = false}, slot) {
    return <div className={["subheader", classIf(isLoading, "loading-text"), classIf(isOnline, "online")]}>
        {slot}
    </div>
}

export default Subheader