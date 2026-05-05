import RejectClaimRequestIcon from "../../../../assets/icons/RejectClaimRequestIcon.svg";

function RejectClaimRequestPopup({ onClose, onConfirm }) {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="w-80 2xl:w-96 rounded-2xl bg-white p-4 2xl:p-6 flex flex-col items-center montserrat">

                <div className="w-16 h-16 2xl:w-20 2xl:h-20 rounded-full bg-[#FEEFEF] flex items-center justify-center mb-4 2xl:mb-5">
                    <img src={RejectClaimRequestIcon} alt="warning" className="w-6 h-6 2xl:w-8 2xl:h-8" />
                </div>

                <h2 className="text-[18px] 2xl:text-[22px] font-semibold text-[#323232] mb-1 2xl:mb-2">
                    Reject this claim?
                </h2>

                <p className="text-[13px] 2xl:text-[15px] font-medium text-[#969696] mb-6 2xl:mb-8 text-center">
                    The request will be denied and the user will be notified.
                </p>

                <div className="w-full flex justify-center items-center gap-7 2xl:gap-9">
                    <button
                        onClick={onConfirm}
                        className="flex items-center gap-2 px-5 py-2 2xl:px-6 2xl:py-2.5 rounded-[10px] bg-[#FEEFEF]"
                    >
                        <span className="text-[#AF0404] font-semibold text-[14px] 2xl:text-[16px] w-15 2xl:w-18">Confirm</span>
                    </button>

                    <button
                        onClick={onClose}
                        className="text-[#323232] font-semibold px-8 py-2 2xl:px-10 2xl:py-2.5 text-[14px] 2xl:text-[16px] flex items-center justify-center"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RejectClaimRequestPopup;

