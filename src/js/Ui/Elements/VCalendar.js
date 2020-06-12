import StatefulComponent from "../../V/VRDOM/component/StatefulComponent"
import {isDateEqual} from "../Utils/utils"
import "./VCalendar.scss"

export default class VCalendar extends StatefulComponent {

	state = {
		date: this.props.date || new Date(),
		selectedMonth: this.props.date || new Date(), //ignore days, just month
	}

	render() {
		let monthName = this.state.selectedMonth.toLocaleString('en', { month: 'long' });

		let test = this.testMonths();
		let prevClasses = {
			arrow: true,
			prev: true,
			rp: true,
			hidden: !test.prev
		}
		let nextClasses = {
			arrow: true,
			next: true,
			rp: true,
			hidden: !test.next
		}
		return (
			<div class="calendar">
				<div class="month">
					<div class={prevClasses} onClick={this.previousMonth}><i class="tgico tgico-down"/></div>
					<div class="name">{`${monthName} ${this.state.selectedMonth.getFullYear()}`}</div>
					<div class={nextClasses} onClick={this.nextMonth}><i class="tgico tgico-down"/></div>
				</div>
				<div class="days">
					<WeekDaysFragment/>
					<MonthDaysFragment month={this.state.selectedMonth} selected={this.state.date} 
					onSelect={this.onDateSelect} test={this.testDate}/>
				</div>
			</div>
			)
	}
	/**
		Tests last date of previous month and first date of the next month
	**/
	testMonths = () => {
		let show = {
			prev: true,
			next: true
		}
		let clone = new Date(this.state.selectedMonth);
		clone.setDate(0);
		if(!this.testDate(clone)) show.prev = false;
		clone.setMonth(clone.getMonth()+2); //we moved a month before last step
		clone.setDate(1);
		if(!this.testDate(clone)) show.next = false;
		return show;
	}

	testDate = (date) => {
		let result = true;
		let now = new Date();
		if(isDateEqual(now, result)) return true;
		if(this.props.blockPast) {
			result = date > now;
		}
		if(this.props.blockFuture) {
			result = result && date < now;
		}
		return result;
	}

	previousMonth = () => {
		let newMonth = new Date(this.state.selectedMonth)
		newMonth.setMonth(newMonth.getMonth()-1);
		this.setState({
			selectedMonth: newMonth
		})
	}

	nextMonth = () => {
		let newMonth = new Date(this.state.selectedMonth)
		newMonth.setMonth(newMonth.getMonth()+1);
		this.setState({
			selectedMonth: newMonth
		})
	}

	onDateSelect = (date) => {
		this.setState({
			date: date,
			//selectedMonth: date
		});
		if(this.props.onSelect) this.props.onSelect(date);
	}
}

const WeekDaysFragment = () => {
	return ([
		<div class="weekday">M</div>,
		<div class="weekday">T</div>,
		<div class="weekday">W</div>,
		<div class="weekday">T</div>,
		<div class="weekday">F</div>,
		<div class="weekday">S</div>,
		<div class="weekday">S</div>,
		])
}

const MonthDaysFragment = ({month, selected, test, onSelect}) => {
	let days = [];
	let copy = new Date(month); //clone
	copy.setDate(1); //start of month
	let skipDays = copy.getDay()-1;
	for(let i = 0; i<skipDays; i++) {
		days.push(<DayFragment/>);
	}

	let iter = new Date(copy);
	while(iter.getMonth() === copy.getMonth()) {
		days.push(<DayFragment day={new Date(iter)} active={test(iter)} 
			selected={isDateEqual(iter, selected)} onSelect={onSelect}/>);
		iter.setDate(iter.getDate() + 1);
	}
	return days;
}

const DayFragment = ({day, selected, active, onSelect}) => {
	if(!day) {
		return <div class="day"></div>;
	}
	let now = new Date();
	let today = isDateEqual(now, day);

	let classes = {
		day: true,
		selected: selected,
		disabled: !active,
		today: today,
	}
	return (
		<div class={classes} onClick={ev => {
			if(active) onSelect(day);
		}}>
			{day.getDate()}
		</div>
		)
}