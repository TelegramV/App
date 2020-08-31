import MessageWrapperFragment from "./MessageWrapperFragment";
import TextWrapperComponent from "./TextWrapperComponent";
import BetterStickerComponent from "../../../../Basic/BetterStickerComponent";
import VUI from "../../../../../VUI";
import {StickerSetModal} from "../../../../Modals/StickerSetModal";
import MessageTimeComponent from "./MessageTimeComponent";

const CardMessageWrapperFragment = ({message, icon, title, description, bubbleRef, onClick, showDate}) => {
    return (
        MessageWrapperFragment(
            {message, showDate, showUsername: false},
            <>
                <div className="card" css-cursor="pointer" onClick={onClick}>
                    <div className="card-icon rp rps rp-white" css-border-radius="5px">
                        {icon}
                    </div>
                    <div className="card-info">
                        <div className="title">
                            {title}
                        </div>
                        <div className="description">
                            {description}
                        </div>
                    </div>
                </div>
                <TextWrapperComponent message={message}/>
            </>
        )
    );
}

export default CardMessageWrapperFragment;