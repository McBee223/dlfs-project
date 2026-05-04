import { useState } from "react";
import { authFetch } from "../../../../utils/authFetch";
import PinIconActive from '../../../../assets/icons/PinIconActive.svg';
import PersonalCategoryIcon from '../../../../assets/icons/PersonalCategoryIcon.svg';
import ElectronicCategoryIcon from '../../../../assets/icons/ElectronicCategoryIcon.svg';
import DocumentCategoryIcon from '../../../../assets/icons/DocumentCategoryIcon.svg';
import ClothingCategoryIcon from '../../../../assets/icons/ClothingCategoryIcon.svg';
import SchoolItemCategoryIcon from '../../../../assets/icons/SchoolItemCategoryIcon.svg';
import BagCategoryIcon from '../../../../assets/icons/BagCategoryIcon.svg';

function PinnedItemsCard({ item, category, description, image, onViewDetails, onUnpin, onClaim, onEditClaim }) {
    const [loading, setLoading] = useState(false);

    const claimStatus = item?.claimStatus;
    const isPending  = claimStatus === 'Pending';
    const isApproved = claimStatus === 'Approved';
    const isRejected = claimStatus === 'Rejected';
    const isReturned = claimStatus === 'Returned';

    const badgeConfig = {
        Pending:  { bg: 'bg-orange-400', label: 'Pending'  },
        Approved: { bg: 'bg-green-500',  label: 'Approved' },
        Rejected: { bg: 'bg-red-400',    label: 'Rejected' },
        Returned: { bg: 'bg-yellow-400', label: 'Claimed'  },
    };
    const badge = badgeConfig[claimStatus];

    const categoryIcons = {
        personal:    PersonalCategoryIcon,
        electronics: ElectronicCategoryIcon,
        document:    DocumentCategoryIcon,
        clothes:     ClothingCategoryIcon,
        schoolitem:  SchoolItemCategoryIcon,
        bags:        BagCategoryIcon
    };
    const normalizedCategory = category?.toLowerCase().replace(/\s+/g, "");
    const icon = categoryIcons[normalizedCategory];

    const handleUnpin = async (e) => {
        e.stopPropagation();
        if (loading) return;
        setLoading(true);
        const token = localStorage.getItem("userToken");
        try {
            const res = await authFetch(`http://localhost:3000/api/user/pinned-items/${item.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) onUnpin?.();
        } catch (err) {
            console.error("Failed to unpin:", err);
        } finally {
            setLoading(false);
        }
    };

    const renderActionButton = () => {
        if (isReturned) return (
            <span className="text-sm font-medium text-yellow-500 px-3 py-2">✓ Claimed</span>
        );
        if (isPending) return (
            <button onClick={(e) => { e.stopPropagation(); onEditClaim?.(item); }} className="text-sm border border-orange-400 text-orange-500 px-3 py-2 rounded-xl hover:bg-orange-50 font-medium">
                Edit Submission
            </button>
        );
        if (isApproved) return (
            <span className="text-sm font-medium text-green-600 px-3 py-2">✓ Approved</span>
        );
        if (isRejected) return (
            <button onClick={(e) => { e.stopPropagation(); onClaim?.(item); }} className="text-sm border border-red-400 text-red-500 px-3 py-2 rounded-xl hover:bg-red-50 font-medium">
                Re-claim
            </button>
        );
        return (
            <button onClick={(e) => { e.stopPropagation(); onClaim?.(item); }} className="text-sm border border-[#047EAF] text-[#047EAF] px-3 py-2 rounded-xl hover:bg-yellow-50">
                View Details
            </button>
        );
    };

    return (
        <div onClick={() => onViewDetails?.(item)} className="montserrat bg-white rounded-2xl p-3 w-full max-w-xs shrink-0 flex flex-col transition-transform duration-200 ease-in-out hover:scale-[1.03] hover:shadow-md cursor-pointer">
            <div className="relative w-full h-36 bg-gray-200 rounded-xl overflow-hidden">
                {image}
                {badge && (
                    <span className={`absolute top-2 left-2 ${badge.bg} text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow`}>
                        {badge.label}
                    </span>
                )}
            </div>

            <div className="my-5 flex items-center gap-2">
                <span className="text-[10px] px-2 py-1 bg-[#E8F7FF] text-[#1980B2] rounded-xl flex items-center gap-1">
                    {icon && <img src={icon} alt="" className="w-3 h-3" />}
                    {category}
                </span>
            </div>

            <p className="text-sm text-gray-700 leading-snug wrap-break-word line-clamp-3">{description}</p>

            <div className="flex items-center justify-between mt-auto pt-4">
                {renderActionButton()}
                <button onClick={handleUnpin} disabled={loading} className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100">
                    <img src={PinIconActive} alt="unpin" />
                </button>
            </div>
        </div>
    );
}

export default PinnedItemsCard;