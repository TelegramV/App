import Button from "./Button";
import AvatarComponent from "../../Basic/AvatarComponent";
import VCheckbox from "../../../Elements/Input/VCheckbox";

function CheckboxAvatarButton({peer, checked = false, isNameAsText = false, isStatusAsDescription = false, ...otherArgs}) {
    return <Button left={<>
        <AvatarComponent peer={peer}/>
        <VCheckbox checked={checked}/>
    </>} {...otherArgs}
                   text={isNameAsText ? peer.name : otherArgs.text}
                   // description={isNumberAsDescription ? "+" + peer.phone : otherArgs.description}
                   description={isStatusAsDescription ? peer.statusString.text : otherArgs.description}

    />
}

export default CheckboxAvatarButton