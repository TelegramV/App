import Button from "./Button";

function IconText({icon, ...otherArgs}) {
    if(otherArgs.hidden === true || otherArgs.text == null || otherArgs.text?.length === 0) return ""
    return <Button left={<i className={"tgico tgico-" + icon}/>} {...otherArgs} onClick={null}/>
}

export default IconText