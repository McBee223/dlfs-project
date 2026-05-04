import { useState } from "react";
import PinnedItemsCard from "../../../ui/userUI/cards/PinnedItemsCard";
import ViewDetailsPopup from "../../../ui/userUI/popups/ViewDetailsPopup";
import ClaimItemPopup from "../../../ui/userUI/popups/ClaimItemPopup";
import ClaimSuccesPopup from "../../../ui/userUI/popups/ClaimSuccesPopup";

function PinnedCardLayout({ pinnedItems, scrollRef, onUnpin }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [showClaimPopup, setShowClaimPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [claimItem, setClaimItem] = useState(null);
    const [editingClaimId, setEditingClaimId] = useState(null);

    const handleViewDetails = (item) => setSelectedItem(item);
    const handleViewClose = () => setSelectedItem(null);

    const handleClaimClick = (item) => {
        if (item.claimStatus === 'Approved') return;
        setSelectedItem(null);
        setClaimItem(item);
        setEditingClaimId(null);
        setShowClaimPopup(true);
    };

    const handleEditClaim = (item) => {
        setSelectedItem(null);
        setClaimItem(item);
        setEditingClaimId(item.userClaimId);
        setShowClaimPopup(true);
    };

    const handleClaimSuccess = () => {
        setShowClaimPopup(false);
        onUnpin?.();
        setTimeout(() => setShowSuccessPopup(true), 100);
    };

    return (
        <>
            <div ref={scrollRef} className="overflow-x-auto overflow-y-visible scrollbar-none scroll-smooth">
                <div className="flex gap-4 px-1 py-3">
                    {pinnedItems.map((item) => {
                        const description = `This ${item.name} was found on ${item.dateFound} and was last seen near ${item.lastSeen}.`;
                        return (
                            <div key={item.id} className="w-68 shrink-0">
                                <PinnedItemsCard
                                    item={item}
                                    category={item.category}
                                    description={description}
                                    image={
                                        item.image ? (
                                            <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                        ) : null
                                    }
                                    onViewDetails={handleViewDetails}
                                    onClaim={handleClaimClick}
                                    onEditClaim={handleEditClaim}
                                    onUnpin={onUnpin}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedItem && (
                <ViewDetailsPopup
                    item={selectedItem}
                    onClose={handleViewClose}
                    onClaim={() => handleClaimClick(selectedItem)}
                    onEditClaim={() => handleEditClaim(selectedItem)}
                    claimStatus={selectedItem?.claimStatus}
                />
            )}

            {showClaimPopup && claimItem && (
                <ClaimItemPopup
                    item={claimItem}
                    claimId={editingClaimId}
                    onClose={() => setShowClaimPopup(false)}
                    onSuccess={handleClaimSuccess}
                />
            )}

            {showSuccessPopup && (
                <ClaimSuccesPopup onClose={() => setShowSuccessPopup(false)} />
            )}
        </>
    );
}

export default PinnedCardLayout;