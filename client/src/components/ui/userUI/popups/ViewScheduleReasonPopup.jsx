
import { useRef } from "react";
import ExitIcon from "../../../../assets/icons/ExitIcon.svg";

function ViewScheduleReasonPopup({ item, onClose }) {
    const modalRef = useRef();

    const formatDate = (str) => {
        if (!str) return null;
        const d = new Date(str);
        if (isNaN(d)) return str;
        return d.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div ref={modalRef} className="montserrat bg-white w-120 2xl:w-145 rounded-2xl shadow-lg p-6 2xl:p-8 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <p className="text-lg 2xl:text-xl font-semibold">Canceled Schedule Reason</p>
                    <button onClick={onClose} className="focus:outline-none focus:ring-0">
                        <img src={ExitIcon} className="w-5 h-5 2xl:w-6 2xl:h-6" />
                    </button>
                </div>

                <div className="bg-[#FFF2F2] border border-red-300 rounded-xl px-4 py-3">
                    <p className="text-sm 2xl:text-base font-semibold text-red-500">Your pickup schedule was canceled</p>
                    <p className="text-xs 2xl:text-sm text-red-400 mt-0.5">Item: <span className="font-semibold">{item?.name}</span></p>
                </div>

                <div>
                    <p className="text-sm 2xl:text-base font-semibold text-gray-700 mb-1">Reason</p>
                    <p className="text-sm 2xl:text-base text-gray-600 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                        {item?.cancelReason || "No reason provided."}
                    </p>
                </div>

                {item?.cancelSuggestedTime && (
                    <div>
                        <p className="text-sm 2xl:text-base font-semibold text-gray-700 mb-1">Suggested New Pickup Time</p>
                        <p className="text-sm 2xl:text-base text-[#047EAF] bg-[#E8F7FF] rounded-xl px-4 py-3 border border-[#047EAF]">
                            {formatDate(item.cancelSuggestedTime)}
                        </p>
                    </div>
                )}

                <p className="text-xs 2xl:text-sm text-gray-400">
                    Please resubmit your claim to arrange a new schedule or contact the admin for further assistance.
                </p>

                <button
                    onClick={onClose}
                    className="w-full bg-[#047EAF] text-white py-2.5 2xl:py-3 rounded-xl font-semibold focus:outline-none focus:ring-0"
                >
                    Got it
                </button>
            </div>
        </div>
    );
}

export default ViewScheduleReasonPopup;
