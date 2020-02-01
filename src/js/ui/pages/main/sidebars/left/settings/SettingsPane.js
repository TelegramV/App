import Component from "../../../../../v/vrdom/Component"

export default class SettingsPane extends Component {
    constructor(props) {
        super(props)
        this.previousPane = props.props.previousPane;
        props.props.addPane(this.getId(), this);
    }

    getId() {
    	return "settings";
    }

    getName() {
        return "Settings"
    }

    open() {
        this.$el.classList.remove("hidden")
        this.$el.classList.remove("fade-out")
        this.$el.classList.add("fade-in")
    }

    close() {
        this.$el.classList.remove("fade-in")
        this.$el.classList.add("fade-out")
        setTimeout(_ => {
            this.$el.classList.add("hidden");
            this.$el.classList.remove("fade-out")
        }, 500);
    }

    onBack() {
        this.close();
        this.previousPane.open();
    }

    makeHeader() {
        return (
            <div class="sidebar-header">
				<i class="btn-icon tgico tgico-back" onClick={this.onBack.bind(this)}/>
				<div class="sidebar-title">{this.getName()}</div>
			</div>
        )
    }
}