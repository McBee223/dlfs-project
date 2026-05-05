import ELIcon from "../../../../assets/icons/ELIcon.svg";
import DLFSwhiteLogo from "../../../../assets/images/DLFSwhiteLogo.svg";

function ELMSButtonCard() {
    const iconSize = "w-9 h-9 2xl:w-10 2xl:h-10";
    const imageSize = "h-9 w-auto 2xl:h-10";

    const openELMS = () => {
        window.open(
            "https://elms.sti.edu/site/not_logged_in?from=%2Fuser_dashboard&log_in_required=true",
            "_blank"
        );
    };

    return (
        <div
            onClick={openELMS}
            className="gradientButton w-60 2xl:w-70 text-white rounded-2xl cursor-pointer hover:opacity-90 transition pt-4 pb-10 flex items-center my-2"
        >
            <div className="flex flex-col justify-center w-full px-4 -pt-10 gap-2">
                <div className="flex justify-between items-center">
                    <img src={DLFSwhiteLogo} alt="DLFS Logo" className={imageSize} />
                    <img src={ELIcon} alt="ELMS Icon" className={iconSize} />
                </div>

                <p className="montserrat font-semibold text-[17px] 2xl:text-[19px]">
                    Go to STI Elms
                </p>

            </div>
        </div>
    );
}

export default ELMSButtonCard;




