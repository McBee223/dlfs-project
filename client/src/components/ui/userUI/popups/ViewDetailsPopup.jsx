import { useState, useEffect, useRef } from "react";
import ExitIcon from '../../../../assets/icons/ExitIcon.svg';

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

    const otherApprovedClaims = approvedClaims.filter(
        c => String(c.user_id) !== String(item.userClaimId)
    );
    const total = otherApprovedClaims.length;
    const current = otherApprovedClaims[carouselIndex];

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
            <div className="montserrat w-full text-center bg-yellow-100 text-yellow-600 font-medium px-2 py-2 mt-2 rounded text-sm">
                ✓ You have claimed this item
            </div>
        );
        if (isAlreadyClaimed) return (
            <div className="montserrat w-full text-center bg-gray-100 text-gray-500 font-medium px-2 py-2 mt-2 rounded text-sm">
                ✗ This item has already been claimed
            </div>
        );
        if (claimStatus === 'Approved') return (
            <div className="montserrat w-full text-center bg-green-100 text-green-600 font-medium px-2 py-2 mt-2 rounded text-sm">
                ✓ Your claim is Approved
            </div>
        );
        if (claimStatus === 'Pending' || claimStatus === 'In Process') return (
            <button
                onClick={() => { onClose(); onEditClaim(item); }}
                className="w-full montserrat bg-orange-400 text-white px-2 py-2 mt-2 rounded text-sm font-medium hover:bg-orange-500"
            >
                Edit Submission
            </button>
        );
        if (claimStatus === 'Rejected') return (
            <button
                onClick={() => { onClose(); onClaim(item); }}
                className="w-full montserrat bg-red-600 text-white px-2 py-2 mt-2 rounded text-sm font-medium hover:bg-red-500"
            >
                Re-claim
            </button>
        );
        return (
            <button
                onClick={() => { onClose(); onClaim(item); }}
                className="w-full montserrat bg-[#1980B2] text-white px-2 py-2 mt-2 rounded text-sm font-medium hover:bg-[#047EAF]"
            >
                Claim Item
            </button>
        );
    };

    return (
        <div className="fixed inset-0 bg-[rgba(100,100,100,0.37)] flex items-center justify-center z-50">
            <div ref={modalRef} className="flex flex-col bg-white w-120 h-140 rounded-2xl shadow-lg p-5">
                <div className="flex justify-between items-center">
                    <p className="montserrat text-lg font-semibold">Item Details</p>
                    <button onClick={onClose}>
                        <img src={ExitIcon} alt="" className="w-7 h-auto" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 mt-3 space-y-3">
                    <p className="montserrat text-sm font-semibold">Image</p>
                    <div className="w-full h-60 rounded-xl overflow-hidden bg-gray-200">
                        {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                No image available
                            </div>
                        )}
                    </div>

                    <p className="montserrat text-sm font-semibold">Item Name</p>
                    <div className="montserrat input">{item.name || "N/A"}</div>

                    <p className="montserrat text-sm font-semibold">Category</p>
                    <div className="montserrat input">{item.category || "N/A"}</div>

                    <p className="montserrat text-sm font-semibold">Date & Time Found</p>
                    <div className="montserrat input">{formatDate(item.dateFound)}</div>

                    <p className="montserrat text-sm font-semibold">Last Seen</p>
                    <div className="montserrat input">{item.lastSeen || "N/A"}</div>

                    {hasOtherApprovedClaim && !isAlreadyClaimed && total > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="montserrat text-xs font-semibold text-orange-500 uppercase tracking-wide">
                                    ⚠ Approved Claimant{total > 1 ? 's' : ''}
                                </p>
                                {total > 1 && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCarouselIndex(i => Math.max(0, i - 1))}
                                            disabled={carouselIndex === 0}
                                            className="w-6 h-6 rounded-full border border-orange-300 text-orange-400 flex items-center justify-center disabled:opacity-30 hover:bg-orange-100 text-xs font-bold"
                                        >
                                            ‹
                                        </button>
                                        <span className="montserrat text-xs text-orange-400 font-semibold">
                                            {carouselIndex + 1} / {total}
                                        </span>
                                        <button
                                            onClick={() => setCarouselIndex(i => Math.min(total - 1, i + 1))}
                                            disabled={carouselIndex === total - 1}
                                            className="w-6 h-6 rounded-full border border-orange-300 text-orange-400 flex items-center justify-center disabled:opacity-30 hover:bg-orange-100 text-xs font-bold"
                                        >
                                            ›
                                        </button>
                                    </div>
                                )}
                            </div>

                            {current && (
                                <>
                                    <p className="montserrat text-sm font-semibold text-orange-500">Approved Claimant</p>
                                    <div className="montserrat input">{current.name || "Unknown"}</div>

                                    <p className="montserrat text-sm font-semibold text-orange-500">Approved On</p>
                                    <div className="montserrat input">{formatDate(current.approved_at)}</div>

                                    <p className="montserrat text-sm font-semibold text-orange-500">Scheduled Pickup</p>
                                    <div className="montserrat input">
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
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-3">
                            <p className="montserrat text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Item Already Claimed
                            </p>
                            <p className="montserrat text-sm font-semibold text-gray-500">Claimed By</p>
                            <div className="montserrat input">{returnedByName || "Unknown"}</div>

                            <p className="montserrat text-sm font-semibold text-gray-500">Date Returned</p>
                            <div className="montserrat input">{formatDate(returnedAt)}</div>
                        </div>
                    )}
                </div>

                {renderClaimButton()}
            </div>
        </div>
    );
}

export default ViewDetailsPopup;