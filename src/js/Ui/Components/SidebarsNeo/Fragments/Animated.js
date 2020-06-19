import Lottie from "../../../Lottie/Lottie";
import nodeIf from "../../../../V/VRDOM/jsx/helpers/nodeIf";

function Animated({animationData, r, hidden = false, playOnHover = true, width = 100, height = 100, loop = true, autoplay = true}) {
    console.log("animated", hidden)
    return <div className="animated">
        {nodeIf(
        <Lottie
            ref={r}
            width={width}
            height={height}
            options={{
                animationData,
                loop,
                autoplay,
            }}
            // onClick={onClick}
            playOnHover={playOnHover}/>, !hidden)}
    </div>
}

export default Animated