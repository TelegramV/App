import Button from "./Button";
import VCheckbox from "../../../Elements/Input/VCheckbox";
import AvatarComponent from "../../Basic/AvatarComponent";
import Locale from "../../../../Api/Localization/Locale"

function AvatarCheckmarkButton({peer, isNameAsText = false, isStatusAsDescription = false, checked = false, ...otherArgs}) {
    return <Button left={<AvatarComponent peer={peer}/>} right={<VCheckbox checked={checked} circle/>} {...otherArgs}
                   text={isNameAsText ? peer.name : otherArgs.text}
                   description={isStatusAsDescription ? Locale.lp(peer.status) : otherArgs.description}/>
}

export default AvatarCheckmarkButton