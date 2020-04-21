import VSpinner from "../../Components/Elements/VSpinner";
import VComponent from "../../../V/VRDOM/component/VComponent";

class TestDeterminateSpinner extends VComponent {
    state = {
        progress: 0
    }

    init() {
        super.init();
        this.withInterval(() => {
                this.state.progress += 0.01
            if(this.state.progress >= 1) {
                this.state.progress = 0
            }
            this.setState({
                progress:  this.state.progress
            })
        }, 100)
    }

    render() {
        return <div>
            <VSpinner determinate big progress={this.state.progress}/>
        </div>
    }
}
export function SpinnerTestPage() {
    const ls = [...Array(100)].map((_, i) => <VSpinner white big progress={0.1} background/>)
    // const ls = [...Array(200)].map((_, i) => <progress className="progress-circular big"></progress>)
    return (
        <div>
            <div  css-background-image={"url(https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_960_720.jpg)"} css-height="100vh" css-filter="blur(5px)" css-position="absolute"
            css-width="100vw" css-left="0" css-top="0"></div>
            <TestDeterminateSpinner/>
            <div css-display="flex" css-flex-wrap="wrap" >
                {ls}
            </div>
        </div>
    )
}