import { useRef, useState } from "react";
import ExitIcon from "../../../../assets/icons/ExitIcon.svg";

function RejectWithReasonPopup({ item, onClose, onConfirm }) {
    const modalRef = useRef();
    const [reason, setReason] = useState("");

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-800">
            <div ref={modalRef} className="montserrat bg-white w-130 2xl:w-155 rounded-2xl shadow-lg p-6 2xl:p-8 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <p className="text-lg 2xl:text-xl font-semibold">Reject Claim</p>
                    <button onClick={onClose} className="focus:outline-none focus:ring-0">
                        <img src={ExitIcon} className="w-5 h-5 2xl:w-6 2xl:h-6" />
                    </button>
                </div>

                <div className="bg-[#FFF2F2] border border-red-300 rounded-xl px-4 py-3">
                    <p className="text-sm 2xl:text-base text-red-500 font-semibold">You are rejecting the claim for:</p>
                    <p className="text-sm 2xl:text-base text-red-400 mt-0.5">{item?.itemName} — {item?.claimant}</p>
                </div>

                <div>
                    <label className="text-sm 2xl:text-base font-medium mb-1 block">
                        Reason for Rejection <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows={4}
                        placeholder="e.g. Item description does not match, insufficient evidence..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="input w-full resize-none 2xl:py-3 2xl:text-base"
                    />
                </div>

                <div className="flex gap-3 mt-2">
                    <button
                        onClick={onClose}
                        className="flex-1 border border-gray-300 text-gray-500 py-2.5 2xl:py-3 rounded-xl font-semibold focus:outline-none focus:ring-0"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={() => onConfirm({ reason })}
                        disabled={!reason.trim()}
                        className="flex-1 bg-red-500 text-white py-2.5 2xl:py-3 rounded-xl font-semibold focus:outline-none focus:ring-0 disabled:opacity-50"
                    >
                        Confirm Rejection
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RejectWithReasonPopup;
