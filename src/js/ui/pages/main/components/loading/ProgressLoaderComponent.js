import VComponent from "../../../../v/vrdom/component/VComponent"

class ProgressLoaderComponent extends VComponent {

	h() {
		let progress = Number.isInteger(this.props.progress)?this.props.progress : 0;
		return (
			<div class="radial-progress" data-progress={progress}>
				<div class="circle">
					<div class="mask full">
						<div class="fill" css-transform={`rotate(${1.8 * progress+"deg"})`}></div>
					</div>
					<div class="mask half">
						<div class="fill"></div>
						<div class="fill fix" css-transform={`rotate(${1.8 * 2 * progress+"deg"})`}></div>
					</div>
				</div>
				<div class="inset">
				</div>
			</div>
			)
	}

	updateProgress(value) {
		this.$el.setAttribute("data-progress", Number.isInteger(value)? value : 0);
	}
}

export default ProgressLoaderComponent;