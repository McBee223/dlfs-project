import { useState } from "react";
import ApprovedIcon from '../../../../assets/icons/ApprovedIcon.svg';
import ClaimedIcon from '../../../../assets/icons/ClaimedIcon.svg';
import InProcessIcon from '../../../../assets/icons/InProcessIcon.svg';
import RejectedIcon from '../../../../assets/icons/RejectedIcon.svg';
import ViewItemPopup from "../popups/ViewItemPopup";
import ClaimItemPopup from "../popups/ClaimItemPopup";

function ItemStatusCard({ id, item, editMode, selected, toggleSelect, activeMenu, setActiveMenu, isTrash = false, onRestore }) {
    const [openPopup, setOpenPopup] = useState(false);
    const [openEditPopup, setOpenEditPopup] = useState(false);

    if (!item || !item.status) return null;

    const displayStatus =
        item.status === 'Returned' ? 'Claimed' :
            item.status === 'Pending' ? 'In Process' :
                item.status === 'In Process' ? 'In Process' :
                    item.status;

    const statusIcons = {
        Approved: ApprovedIcon,
        Claimed: ClaimedIcon,
        "In Process": InProcessIcon,
        Rejected: RejectedIcon,
    };

    const Icon = statusIcons[displayStatus];
    const canEdit = !isTrash && (item.status === "In Process" || item.status === "Pending");

    const displayMessage = item.status === 'Returned'
        ? 'Your item has been claimed and returned successfully.'
        : item.status === 'Pending'
            ? 'Your claim request is pending review.'
            : item.status === 'In Process'        
                ? 'Your re-claim is currently under review.'
                : (item.message ?? "-");

    return (
        <>
            <div className="relative grid grid-cols-[166px_147px_440px_150px_90px_130px] my-3 py-3 px-7 items-center text-sm text-[#646464] font-semibold ">
                <div className="flex items-center gap-2">
                    {editMode && (
                        <input type="checkbox" checked={selected} onChange={toggleSelect} />
                    )}
                    <p>{item.item ?? "-"}</p>
                </div>
                <p>{item.type ?? "-"}</p>
                <p>{displayMessage}</p>
                <p>{item.date ?? "-"}</p>
                {Icon && <img src={Icon} className="w-45 h-auto" />}
                <button onClick={() => setActiveMenu(activeMenu === id ? null : id)}>•••</button>

                {activeMenu === id && (
                    <>
                        {/* invisible backdrop to close on outside click */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setActiveMenu(null)}
                        />
                        <div className="absolute right-0 -top-6 bg-white border border-[#D8D8D8] rounded-lg px-4 py-2 text-sm z-50 flex flex-col gap-1 shadow">
                            {!isTrash && (
                                <button
                                    className="block text-left hover:text-[#047EAF]"
                                    onClick={() => { setOpenPopup(true); setActiveMenu(null); }}
                                >
                                    View Item
                                </button>
                            )}
                            {canEdit && (
                                <button
                                    className="block text-left hover:text-amber-500"
                                    onClick={() => { setOpenEditPopup(true); setActiveMenu(null); }}
                                >
                                    Edit Submission
                                </button>
                            )}
                            {isTrash && (
                                <button
                                    className="block text-left hover:text-[#047EAF]"
                                    onClick={() => { onRestore(id); setActiveMenu(null); }}
                                >
                                    Restore
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>

            {openPopup && (
                <ViewItemPopup item={item} onClose={() => setOpenPopup(false)} />
            )}

            {openEditPopup && (
                <ClaimItemPopup
                    item={item}
                    claimId={item.claim_id}
                    onClose={() => setOpenEditPopup(false)}
                    onSuccess={() => setOpenEditPopup(false)}
                />
            )}
        </>
    );
}

export default ItemStatusCard;