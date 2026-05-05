import WarningIcon from "../../../../assets/icons/WarningIcon.svg";
import TrashIcon from "../../../../assets/icons/TrashIcon.svg";

function DeleteForeverConfirmationPopup({ onClose, onConfirm }) {

    return (
        <div className="w-80 2xl:w-100 rounded-2xl bg-white p-4 2xl:p-6 flex flex-col items-center montserrat">
            <div className="w-80 2xl:w-100 rounded-2xl bg-white p-4 flex flex-col items-center montserrat">

                <div className="w-16 h-16 2xl:w-20 2xl:h-20 rounded-full bg-[#FEEFEF] flex items-center justify-center mb-4">
                    <img src={WarningIcon} alt="warning" className="w-6 h-6 2xl:w-10 2xl:h-10" />
                </div>

                <h2 className="text-[18px] 2xl:text-[20px] font-semibold text-[#323232] mb-1">
                    Delete Item
                </h2>

                <p className="text-[13px] 2xl:text-[15px] font-medium text-[#969696] mb-6 text-center">
                    This action cannot be undone. The Item and its data will be deleted.
                </p>

                <div className="w-full flex justify-center items-center gap-7">
                    <button
                        onClick={onConfirm}
                        className="flex items-center gap-2 px-5 py-2 2xl:px-6 2xl:py-3 rounded-[10px] bg-[#FEEFEF]"
                    >
                        <span className="text-[#AF0404] font-semibold text-[14px] 2xl:text-[16px] w-15">Delete</span>
                        <img src={TrashIcon} alt="trash" className="w-4 h-4 2xl:w-5 2xl:h-5" />
                    </button>

                    <button
                        onClick={onClose}
                        className="text-[#323232] font-semibold px-8 py-2 2xl:px-9 2xl:py-3 text-[14px] 2xl:text-[16px] flex items-center justify-center"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteForeverConfirmationPopup;



