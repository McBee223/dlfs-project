import ExitIcon from '../../../../assets/icons/ExitIcon.svg';
import TrashIcon from '../../../../assets/icons/TrashIcon.svg';

function MoveToArchiveConfirmationPopup({ onClose, onConfirm }) {
    return (
        <div className="montserrat bg-white rounded-2xl shadow-lg p-5 2xl:p-7 w-100 2xl:w-120">
            <div className="flex justify-between items-start mb-3">
                <h2 className="text-[#323232] text-base 2xl:text-lg font-semibold">
                    Move this Account to Trash?
                </h2>
                <button onClick={onClose}>
                    <img src={ExitIcon} className="w-5 h-5 2xl:w-6 2xl:h-6" />
                </button>
            </div>
            <p className="text-[#969696] text-sm 2xl:text-base mb-6">
                The Account will be removed from the active list but can still be restored later.
            </p>
            <button
                onClick={onConfirm}
                className="w-full py-3 2xl:py-4 px-4 rounded-lg text-[#AF0404] bg-[#FEEFEF] text-sm 2xl:text-base font-semibold flex justify-between items-center"
            >
                <span>Yes, Move to Trash</span>
                <img src={TrashIcon} className="w-5 h-5 2xl:w-6 2xl:h-6" />
            </button>
        </div>
    );
}

export default MoveToArchiveConfirmationPopup;