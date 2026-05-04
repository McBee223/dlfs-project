import ExitIcon from '../../../../assets/icons/ExitIcon.svg';
import TrashIcon from '../../../../assets/icons/TrashIcon.svg';

function MoveToArchiveConfirmationPopup({ onClose, onConfirm }) {
    return (
        <div className="montserrat bg-white rounded-2xl shadow-lg p-5 w-100 ">

            <div className="flex justify-between items-start mb-3">
                <h2 className="text-[#323232] text-base font-semibold">
                    Move this Account to Trash?
                </h2>

                <button onClick={onClose}>
                    <img src={ExitIcon} className="w-5 h-5" />
                </button>
            </div>

            <p className="text-[#969696] text-sm mb-6">
                The Account will be removed from the active list but can still be restored later.
            </p>

            <button
                onClick={onConfirm}
                className="w-full py-3 px-4 rounded-lg text-[#AF0404] bg-[#FEEFEF] text-sm font-semibold flex justify-between items-center"
            >
                <span>Yes, Move to Trash</span>
                <img src={TrashIcon} className="w-5 h-5" />
            </button>

        </div>
    );
}

export default MoveToArchiveConfirmationPopup;