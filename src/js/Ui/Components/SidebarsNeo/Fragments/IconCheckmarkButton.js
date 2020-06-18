import Button from "./Button";
import VCheckbox from "../../../Elements/Input/VCheckbox";

function IconCheckmarkButton({icon, checked = false, ...otherArgs}) {
    return <Button left={<i className={"tgico tgico-" + icon}/>} right={<VCheckbox checked={checked} circle/>} {...otherArgs}/>
}

export default IconCheckmarkButton