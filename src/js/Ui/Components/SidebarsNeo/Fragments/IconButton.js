import Button from "./Button";

function IconButton({icon, ...otherArgs}) {
    return <Button left={<i className={"tgico tgico-" + icon}/>} {...otherArgs}/>
}

export default IconButton