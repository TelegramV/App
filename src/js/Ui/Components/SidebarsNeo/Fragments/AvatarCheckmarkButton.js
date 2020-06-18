import Button from "./Button";
import VCheckbox from "../../../Elements/Input/VCheckbox";
import AvatarComponent from "../../Basic/AvatarComponent";

function AvatarCheckmarkButton({peer, isNameAsText = false, checked = false, ...otherArgs}) {
    return <Button left={<AvatarComponent peer={peer}/>} right={<VCheckbox checked={checked} circle/>} {...otherArgs}
                   text={isNameAsText ? peer.name : otherArgs.text}/>
}

export default AvatarCheckmarkButton