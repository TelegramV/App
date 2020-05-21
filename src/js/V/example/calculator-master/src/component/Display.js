import "./Display.css";
import StatelessComponent from "../../../../VRDOM/component/StatelessComponent"

export default class Display extends StatelessComponent {
    render() {
        return (
            <div className="component-display">
                <div>{this.props.value}</div>
            </div>
        );
    }
}
