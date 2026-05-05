import { useState, useEffect, useRef } from "react";
import ExitIcon from '../../../../assets/icons/ExitIcon.svg';
import WarningIconApprove from '../../../../assets/icons/WarningIconApprove.svg';

function ViewDetailsPopup({
    item, onClose, onClaim, onEditClaim,
    claimStatus, itemStatus,
    returnedByName, returnedAt,
    approvedClaims = [],
    hasOtherApprovedClaim
}) {
    const modalRef = useRef();
    const [carouselIndex, setCarouselIndex] = useState(0);

    useEffect(() => {
        setCarouselIndex(0);
    }, [item]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!item) return null;

    const isAlreadyClaimed = itemStatus === 'Returned';

    const total = approvedClaims.length;
    const current = approvedClaims[carouselIndex];

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        const date = new Date(dateStr);
        return date.toLocaleString("en-US", {
            month: "long", day: "numeric", year: "numeric",
            hour: "numeric", minute: "2-digit", hour12: true,
        });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return "N/A";
        const [hours, minutes] = timeStr.split(":");
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    };

    const formatPickupDate = (dateStr) => {
        if (!dateStr) return "Not set";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "long", day: "numeric", year: "numeric"
        });
    };

    const renderClaimButton = () => {
        if (claimStatus === 'Returned') return (
            <div className="montserrat w-full text-center bg-yellow-100 text-yellow-600 font-medium px-2 py-2 2xl:px-4 2xl:py-3 mt-2 2xl:mt-4 rounded text-sm 2xl:text-base">
                ✓ You have claimed this item
            </div>
        );
        if (isAlreadyClaimed) return (
            <div className="montserrat w-full text-center bg-gray-100 text-gray-500 font-medium px-2 py-2 2xl:px-4 2xl:py-3 mt-2 2xl:mt-4 rounded text-sm 2xl:text-base">
                ✗ This item has already been claimed
            </div>
        );
        if (claimStatus === 'Approved') return (
            <div className="montserrat w-full text-center bg-green-100 text-green-600 font-medium px-2 py-2 2xl:px-4 2xl:py-3 mt-2 2xl:mt-4 rounded text-sm 2xl:text-base">
                ✓ Your claim is Approved
            </div>
        );
        if (claimStatus === 'Pending' || claimStatus === 'In Process') return (
            <button
                onClick={() => { onClose(); onEditClaim(item); }}
                className="w-full montserrat bg-orange-400 text-white px-2 py-2 2xl:px-4 2xl:py-3 mt-2 2xl:mt-4 rounded text-sm 2xl:text-base font-medium hover:bg-orange-500"
            >
                Edit Submission
            </button>
        );
        if (claimStatus === 'Rejected') return (
            <button
                onClick={() => { onClose(); onClaim(item); }}
                className="w-full montserrat bg-red-600 text-white px-2 py-2 2xl:px-4 2xl:py-3 mt-2 2xl:mt-4 rounded text-sm 2xl:text-base font-medium hover:bg-red-500"
            >
                Re-claim
            </button>
        );
        return (
            <button
                onClick={() => { onClose(); onClaim(item); }}
                className="w-full montserrat bg-[#1980B2] text-white px-2 py-2 2xl:px-4 2xl:py-3 mt-2 2xl:mt-4 rounded text-sm 2xl:text-base font-medium hover:bg-[#047EAF]"
            >
                Claim Item
            </button>
        );
    };

    return (
        <div className="fixed inset-0 bg-[rgba(100,100,100,0.37)] flex items-center justify-center z-50">
            <div ref={modalRef} className="flex flex-col bg-white w-120 h-140 2xl:w-160 2xl:h-[90vh] rounded-2xl shadow-lg p-5 2xl:p-7">
                <div className="flex justify-between items-center">
                    <p className="montserrat text-lg 2xl:text-2xl font-semibold">Item Details</p>
                    <button onClick={onClose}>
                        <img src={ExitIcon} alt="" className="w-7 2xl:w-9 h-auto" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 mt-3 2xl:mt-4 space-y-3 2xl:space-y-4">
                    <p className="montserrat text-sm 2xl:text-base font-semibold">Image</p>
                    <div className="w-full h-60 2xl:h-88 rounded-xl overflow-hidden bg-gray-200">
                        {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm 2xl:text-base">
                                No image available
                            </div>
                        )}
                    </div>

                    <p className="montserrat text-sm 2xl:text-base font-semibold">Item Name</p>
                    <div className="montserrat input 2xl:px-5 2xl:py-4 2xl:text-base 2xl:mb-6">{item.name || "N/A"}</div>

                    <p className="montserrat text-sm 2xl:text-base font-semibold">Category</p>
                    <div className="montserrat input 2xl:px-5 2xl:py-4 2xl:text-base 2xl:mb-6">{item.category || "N/A"}</div>

                    <p className="montserrat text-sm 2xl:text-base font-semibold">Date & Time Found</p>
                    <div className="montserrat input 2xl:px-5 2xl:py-4 2xl:text-base 2xl:mb-6">{formatDate(item.dateFound)}</div>

                    <p className="montserrat text-sm 2xl:text-base font-semibold">Last Seen</p>
                    <div className="montserrat input 2xl:px-5 2xl:py-4 2xl:text-base 2xl:mb-6">{item.lastSeen || "N/A"}</div>

                    {total > 0 && !isAlreadyClaimed && claimStatus !== 'Approved' && claimStatus !== 'Returned' && (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 2xl:p-5 space-y-3 2xl:space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex gap-1 2xl:gap-2">
                                    <img src={WarningIconApprove} alt="" className="w-5 h-5 2xl:w-6 2xl:h-6" />
                                    <p className="montserrat text-sm 2xl:text-base font-semibold text-orange-600 uppercase tracking-wide">
                                        Approved Claimant{total > 1 ? 's' : ''}
                                    </p>
                                </div>
                                {total > 1 && (
                                    <div className="flex items-center gap-2 2xl:gap-3">
                                        <button
                                            onClick={() => setCarouselIndex(i => Math.max(0, i - 1))}
                                            disabled={carouselIndex === 0}
                                            className="relative w-6 h-6 2xl:w-8 2xl:h-8 rounded-full border border-orange-300 text-orange-400 flex items-center justify-center disabled:opacity-30 hover:bg-orange-100 text-2xl p-0 font-bold"
                                        >
                                            <span className="absolute -top-2 text-2xl 2xl:text-3xl"> ‹ </span>
                                        </button>
                                        <span className="montserrat text-xs 2xl:text-sm text-orange-400 font-semibold">
                                            {carouselIndex + 1} / {total}
                                        </span>
                                        <button
                                            onClick={() => setCarouselIndex(i => Math.min(total - 1, i + 1))}
                                            disabled={carouselIndex === total - 1}
                                            className="relative w-6 h-6 2xl:w-8 2xl:h-8 rounded-full border border-orange-300 text-orange-400 flex items-center justify-center disabled:opacity-30 hover:bg-orange-100 text-2xl p-0 font-bold"
                                        >
                                            <span className="absolute -top-2 text-2xl 2xl:text-3xl"> › </span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {current && (
                                <>
                                    <p className="montserrat text-sm 2xl:text-base font-semibold text-orange-500">Approved Claimant</p>
                                    <div className="montserrat input 2xl:px-5 2xl:py-4 2xl:text-base 2xl:mb-6">{current.name || "Unknown"}</div>

                                    <p className="montserrat text-sm 2xl:text-base font-semibold text-orange-500">Approved On</p>
                                    <div className="montserrat input 2xl:px-5 2xl:py-4 2xl:text-base 2xl:mb-6">{formatDate(current.approved_at)}</div>

                                    <p className="montserrat text-sm 2xl:text-base font-semibold text-orange-500">Scheduled Pickup</p>
                                    <div className="montserrat input 2xl:px-5 2xl:py-4 2xl:text-base 2xl:mb-6">
                                        {current.pickup_date
                                            ? `${formatPickupDate(current.pickup_date)} at ${formatTime(current.pickup_time)}`
                                            : "Not set"
                                        }
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {isAlreadyClaimed && (
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 2xl:p-5 space-y-3 2xl:space-y-4">
                            <p className="montserrat text-xs 2xl:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                Item Already Claimed
                            </p>
                            <p className="montserrat text-sm 2xl:text-base font-semibold text-gray-500">Claimed By</p>
                            <div className="montserrat input 2xl:px-5 2xl:py-4 2xl:text-lg 2xl:mb-6">{returnedByName || "Unknown"}</div>

                            <p className="montserrat text-sm 2xl:text-base font-semibold text-gray-500">Date Returned</p>
                            <div className="montserrat input 2xl:px-5 2xl:py-4 2xl:text-lg 2xl:mb-6">{formatDate(returnedAt)}</div>
                        </div>
                    )}
                </div>

                {renderClaimButton()}
            </div>
        </div>
    );
}

export default ViewDetailsPopup;




