import MessageWrapperComponent from "./messageWrapperComponent"
import TextWrapperComponent from "./TextWrapperComponent";
import GeneralMessageComponent from "./GeneralMessageComponent"


class TextMessageComponent extends GeneralMessageComponent {

    h() {
        const username = this.message.from.name && !this.message.isPost && !this.message.isOut

        return (
            <MessageWrapperComponent message={this.message}>
                {username ? <div className="username">{this.message.from.name}</div> : ""}
                <TextWrapperComponent message={this.message}/>
            </MessageWrapperComponent>
        )
    }
}

export default TextMessageComponent