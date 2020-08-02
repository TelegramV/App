import Button from "./Button";
import AvatarComponent from "../../Basic/AvatarComponent";
import VCheckbox from "../../../Elements/Input/VCheckbox";
import Locale from "../../../../Api/Localization/Locale"

function CheckboxAvatarButton({peer, checked = false, isNameAsText = false, isStatusAsDescription = false, ...otherArgs}) {
    return <Button left={<>
        <AvatarComponent peer={peer}/>
        <VCheckbox checked={checked}/>
    </>} {...otherArgs}
                   text={isNameAsText ? peer.name : otherArgs.text}
                   // description={isNumberAsDescription ? "+" + peer.phone : otherArgs.description}
                   description={isStatusAsDescription ? Locale.lp(peer.status) : otherArgs.description}

    />
}

export default CheckboxAvatarButton