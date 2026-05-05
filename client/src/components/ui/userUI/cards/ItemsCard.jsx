import { useState } from "react";
import { authFetch } from "../../../../utils/authFetch";
import PersonalCategoryIcon from '../../../../assets/icons/PersonalCategoryIcon.svg';
import ElectronicCategoryIcon from '../../../../assets/icons/ElectronicCategoryIcon.svg';
import DocumentCategoryIcon from '../../../../assets/icons/DocumentCategoryIcon.svg';
import ClothingCategoryIcon from '../../../../assets/icons/ClothingCategoryIcon.svg';
import SchoolItemCategoryIcon from '../../../../assets/icons/SchoolItemCategoryIcon.svg';
import BagCategoryIcon from '../../../../assets/icons/BagCategoryIcon.svg';
import PinIcon from '../../../../assets/icons/PinIcon.svg';
import PinIconActive from '../../../../assets/icons/PinIconActive.svg';

function ItemsCard({ item, category, description, image, onViewDetails, pinnedIds, onPinChange, onClaim, onEditClaim, approvedClaimsCount, hasCancelNotif, onDismissCancelNotif }) {
    const isPinned = pinnedIds?.includes(String(item?.id));
    const claimStatus = item?.claimStatus;
    const isPending = claimStatus === 'Pending';
    const isApproved = claimStatus === 'Approved';
    const isRejected = claimStatus === 'Rejected';
    const isReturned = claimStatus === 'Returned';
    const [loading, setLoading] = useState(false);

    const isAlreadyClaimed = item?.status === 'Returned' && claimStatus !== 'Returned';

    const badgeConfig = {
        Pending: { bg: 'bg-orange-400', label: 'Pending' },
        'In Process': { bg: 'bg-orange-400', label: 'In Process' },
        Approved: { bg: 'bg-green-500', label: 'Approved' },
        Rejected: { bg: 'bg-red-400', label: 'Rejected' },
        Returned: { bg: 'bg-yellow-400', label: 'Claimed' },
    };

    const badge = isAlreadyClaimed
        ? { bg: 'bg-gray-400', label: 'Already Claimed' }
        : badgeConfig[claimStatus];

    const categoryIcons = {
        personal: PersonalCategoryIcon,
        electronics: ElectronicCategoryIcon,
        document: DocumentCategoryIcon,
        clothes: ClothingCategoryIcon,
        schoolitem: SchoolItemCategoryIcon,
        bags: BagCategoryIcon
    };
    const normalizedCategory = category?.toLowerCase().replace(/\s+/g, "");
    const icon = categoryIcons[normalizedCategory];

    const handlePin = async (e) => {
        e.stopPropagation();
        if (loading) return;
        setLoading(true);
        const token = localStorage.getItem("userToken");
        try {
            if (!isPinned) {
                const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/user/pinned-items`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ lost_item_id: item.id })
                });
                if (res.ok) onPinChange?.(item.id, true);
            } else {
                const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/user/pinned-items/${item.id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) onPinChange?.(item.id, false);
            }
        } catch (err) {
            console.error("Pin error:", err);
        } finally {
            setLoading(false);
        }
    };

    const renderActionButton = () => {
        if (isAlreadyClaimed) return (
            <span className="text-sm 2xl:text-base font-medium text-gray-400 px-3 py-2">✗ Already Claimed</span>
        );
        if (isReturned) return (
            <span className="text-sm 2xl:text-base font-medium text-yellow-500 px-3 py-2">✓ Claimed</span>
        );
        if (isPending || claimStatus === 'In Process') return (
            <button
                onClick={(e) => { e.stopPropagation(); onEditClaim?.(item); }}
                className="text-sm 2xl:text-base border border-orange-400 text-orange-500 px-3 py-2 rounded-xl hover:bg-orange-50 font-medium"
            >
                Edit Submission
            </button>
        );
        if (isApproved) return (
            <span className="text-sm 2xl:text-base font-medium text-green-600 px-3 py-2">✓ Approved</span>
        );
        if (isRejected) return (
            <button
                onClick={(e) => { e.stopPropagation(); onClaim?.(item); }}
                className="text-sm 2xl:text-base border border-red-400 text-red-500 px-3 py-2 rounded-xl hover:bg-red-50 font-medium"
            >
                Re-claim
            </button>
        );
        return (
            <button
                onClick={(e) => { e.stopPropagation(); onViewDetails?.(item); }}
                className="text-sm 2xl:text-base border border-[#047EAF] text-[#047EAF] px-3 py-2 rounded-xl hover:bg-[#E8F7FF]"
            >
                View Details
            </button>
        );
    };

    return (
        <div
            onClick={() => onViewDetails?.(item)}
            className="montserrat bg-white rounded-2xl p-3 2xl:p-4 w-full max-w-xs 2xl:max-w-sm flex flex-col transition-transform duration-200 ease-in-out hover:scale-[1.03] cursor-pointer relative"
        >
            {hasCancelNotif && (
                <div
                    className="absolute -top-2 -right-2 z-20 group/notif"
                    onClick={(e) => { e.stopPropagation(); onDismissCancelNotif?.(); }}
                >
                    <div className="2xl:w-4 2xl:h-4 w-5 h-5 bg-[#047EAF] rounded-full shadow-md cursor-pointer animate-pulse" />
                    <div className="absolute right-0 top-6 w-60 bg-[#047EAF] text-white text-xs 2xl:text-sm px-3 py-2.5 rounded-xl shadow-lg opacity-0 group-hover/notif:opacity-100 transition-opacity duration-200 pointer-events-none z-30 leading-relaxed">
                        Your pickup schedule has been canceled by the admin. Please resubmit your claim to arrange a new one or wait for the admin to approve it again.
                        <div className="absolute -top-1.5 right-1 border-4 border-transparent border-b-[#047EAF]" />
                    </div>
                </div>
            )}

            <div className="relative w-full h-36 2xl:h-46 bg-gray-200 rounded-xl overflow-hidden">
                {image}
                {badge && (
                    <span className={`absolute top-2 left-2 ${badge.bg} text-white text-[10px] 2xl:text-[12px] font-semibold px-2 py-0.5 2xl:px-3 2xl:py-0.6 rounded-full shadow`}>
                        {badge.label}
                    </span>
                )}
                {approvedClaimsCount > 0 && !isAlreadyClaimed && (
                    <span className="absolute top-2 right-2 bg-white text-[#047EAF] text-[10px] 2xl:text-[12px] font-bold px-2 py-0.5 2xl:px-3 2xl:py-0.6 rounded-full shadow border border-[#047EAF]">
                        {approvedClaimsCount} claim{approvedClaimsCount > 1 ? 's' : ''}
                    </span>
                )}
            </div>

            <div className="my-5 flex items-center gap-2">
                <span className="text-[10px] 2xl:text-[12px] px-2 py-1 bg-[#E8F7FF] text-[#1980B2] rounded-xl flex items-center gap-1">
                    {icon && <img src={icon} alt="" className="w-3 h-3 2xl:w-4 2xl:h-4" />}
                    {category}
                </span>
            </div>

            <p className="text-sm 2xl:text-base text-gray-700 leading-snug wrap-break-word line-clamp-3">{description}</p>

            <div className="flex items-center justify-between mt-auto pt-4">
                {renderActionButton()}
                <button
                    onClick={handlePin}
                    disabled={loading}
                    className="w-8 h-8 2xl:w-9 2xl:h-9 flex items-center justify-center rounded-full border border-gray-200"
                >
                    <img src={isPinned ? PinIconActive : PinIcon} alt="pin" className="w-full h-full"/>
                </button>
            </div>
        </div>
    );
}

export default ItemsCard;

