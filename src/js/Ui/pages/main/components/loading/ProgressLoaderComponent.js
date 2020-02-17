import VComponent from "../../../../../V/VRDOM/component/VComponent"

class ProgressLoaderComponent extends VComponent {

	h() {
		let progress = Number.isInteger(this.props.progress)?this.props.progress : 0;
		return (
			<svg class="progress-ring">
			  <circle class="progress-ring__circle"/>
			</svg>
			)
	}

	mounted() {
		this.circle = this.$el.querySelector('.progress-ring__circle');
		this.withTimeout(this._calculateSize, 0);
	}

	_calculateSize = () => {
		const radius = this.circle.getBBox().width / 2;
		this.circumference = 2 * Math.PI * radius;

		this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
		this.circle.style.strokeDashoffset = this.circumference;

		if(this.props.progress) {
			this.setProgress(this.props.progress/100);
		}
	}

	/**
		0.0 - 1.0 percent
	**/

	setProgress = (percent) => {
		if(!percent) percent = 0;
		const offset = this.circumference - percent * this.circumference;
		this.circle.style.strokeDashoffset = offset;
	}
}

export default ProgressLoaderComponent;