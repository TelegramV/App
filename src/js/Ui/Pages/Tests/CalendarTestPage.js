import VCalendar from "../../Elements/VCalendar"
export default function CalendarTestPage() {
    return (
    	<div>
        	<VCalendar blockFuture onSelect={date => console.log(date)}/>
        </div>
    )
}