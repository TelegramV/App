import Button from "./Button";
import AvatarComponent from "../../Basic/AvatarComponent";

function AvatarButton({peer, isNameAsText = false, isNumberAsDescription = false,...otherArgs}) {
    return <Button left={<AvatarComponent peer={peer}/>} {...otherArgs}
                   text={isNameAsText ? peer.name : otherArgs.text}
                   description={isNumberAsDescription && peer.phone ? "+" + peer.phone : otherArgs.description}/>
}

export default AvatarButton