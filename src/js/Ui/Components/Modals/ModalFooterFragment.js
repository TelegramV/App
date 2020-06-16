import VUI from "../../VUI"
import StatelessComponent from "../../../V/VRDOM/component/StatelessComponent"
import VButton from "../../Elements/Button/VButton"

export class ModalFooterFragment extends StatelessComponent {
    render() {
        return <div className="footer">
            {this.props.buttons.map(l => {
                return <VButton onClick={l.onClick}>{l.text}</VButton>
            })}
        </div>
    }
}