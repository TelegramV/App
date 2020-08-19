import {Section} from "./Section";
import RadioButton from "./RadioButton";
import StatefulComponent from "../../../../V/VRDOM/component/StatefulComponent";

export class RadioSection extends StatefulComponent {
    state = {
        checked: 0
    }

    render(props) {
        return <Section {...props}>
            {props.radios.map((l, index) => {
                return <RadioButton {...l} checked={this.state.checked === index} onClick={_ => this.check(index)}/>
            })}
        </Section>
    }

    check(index) {
        this.setState({
            checked: index
        })
        if(this.props.onSelect) {
            this.props.onSelect(index)
        }
    }
}