import MessageWrapperFragment from "./MessageWrapperFragment";
import TextWrapperFragment from "./TextWrapperFragment";

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
                {TextWrapperFragment({message})}
            </>
        )
    );
};

export default CardMessageWrapperFragment;