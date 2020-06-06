import Button from "./Button";
import VCheckbox from "../../Elements/VCheckbox";

function CheckboxButton({checked = false, isDescriptionAsState = false, ...otherArgs}) {
    return <Button left={<VCheckbox checked={checked}/>} {...otherArgs} description={isDescriptionAsState ? (checked ? "Enabled" : "Disabled") : otherArgs.description}/>
}

export default CheckboxButton