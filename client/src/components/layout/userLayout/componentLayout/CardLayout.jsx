import { useState, useEffect, useCallback, useRef } from "react";
import { authFetch } from "../../../../utils/authFetch";
import ItemsCard from "../../../ui/userUI/cards/ItemsCard";
import ViewDetailsPopup from "../../../ui/userUI/popups/ViewDetailsPopup";
import ClaimItemPopup from "../../../ui/userUI/popups/ClaimItemPopup";
import ClaimSuccesPopup from "../../../ui/userUI/popups/ClaimSuccesPopup";

const TABS = [
    { key: "lost", label: "Lost Items" },
    { key: "other_approved", label: "Other Approved" },
    { key: "other_claimed", label: "Other Claimed" },
    { key: "your_approved", label: "Your Approved" },
    { key: "your_claimed", label: "Your Claimed" },
];

function CardLayout({ pinnedIds, onPinChange, activeCategory, onClaimSuccess, searchQuery }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [showClaimPopup, setShowClaimPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [claimItem, setClaimItem] = useState(null);
    const [lostItems, setLostItems] = useState([]);
    const [editingClaimId, setEditingClaimId] = useState(null);
    const [activeTab, setActiveTab] = useState("lost");
    const [dismissedCancels, setDismissedCancels] = useState(() => {
        const stored = localStorage.getItem("dismissedCancelNotifs");
        return stored ? JSON.parse(stored) : [];
    });

    const isSearching = searchQuery?.trim().length > 0;

    const dismissCancelNotif = (itemId, claimId) => {
        const updated = [...dismissedCancels, String(itemId)];
        setDismissedCancels(updated);
        localStorage.setItem("dismissedCancelNotifs", JSON.stringify(updated));

        if (claimId) {
            const token = localStorage.getItem("userToken");
            authFetch(`http://localhost:3000/api/user/claims/${claimId}/dismiss-cancel-notif`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            }).catch(err => console.error('Failed to dismiss notif:', err));
        }
    };

    const fetchItems = useCallback(() => {
        const token = localStorage.getItem("userToken");
        authFetch("http://localhost:3000/api/user/lost-items", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.items) {
                    const mapped = data.items.map((item) => ({
                        id: item.id,
                        name: item.name || "Unknown Item",
                        category: item.category || "Uncategorized",
                        dateFound: item.date_found || "-",
                        lastSeen: item.last_seen || "-",
                        image: item.image || "",
                        status: item.status || "Unclaimed",
                        additional_info: item.additional_info || "",
                        userClaimId: item.user_claim_id || null,
                        claimStatus: item.claim_status || null,
                        returnedByName: item.returned_by_name || null,
                        returnedAt: item.returned_at || null,
                        approvedClaims: Array.isArray(item.approved_claims)
                            ? item.approved_claims
                            : (item.approved_claims ? JSON.parse(item.approved_claims) : []),
                        hasOtherApprovedClaim:
                            Array.isArray(item.approved_claims)
                                ? item.approved_claims.length > 0 && item.claim_status !== 'Approved'
                                : false,
                        hasCancelNotif: item.has_cancel_notif === 1 || item.has_cancel_notif === true,
                    }));
                    setLostItems(mapped);
                }
            })
            .catch((err) => console.error("Failed to fetch lost items:", err));
    }, []);

    useEffect(() => {
        fetchItems();
        const interval = setInterval(fetchItems, 2000);
        return () => clearInterval(interval);
    }, [fetchItems]);

    const lastAutoSwitchedQuery = useRef("");

    useEffect(() => {
        if (!searchQuery?.trim()) return;
        if (lastAutoSwitchedQuery.current === searchQuery) return;

        const q = searchQuery.toLowerCase();
        const matchesSearch = (item) =>
            item.name?.toLowerCase().includes(q) ||
            item.category?.toLowerCase().includes(q) ||
            item.lastSeen?.toLowerCase().includes(q) ||
            item.additional_info?.toLowerCase().includes(q);

        const tabFilters = {
            lost: lostItems.filter(item =>
                item.status !== 'Returned' &&
                item.approvedClaims.length === 0 &&
                item.claimStatus !== 'Approved' &&
                item.claimStatus !== 'Returned' &&
                matchesSearch(item)
            ),
            other_approved: lostItems.filter(item =>
                item.status !== 'Returned' &&
                item.approvedClaims.length > 0 &&
                item.claimStatus !== 'Approved' &&
                matchesSearch(item)
            ),
            other_claimed: lostItems.filter(item =>
                item.status === 'Returned' &&
                item.claimStatus == null &&
                matchesSearch(item)
            ),
            your_approved: lostItems.filter(item =>
                item.claimStatus === 'Approved' &&
                matchesSearch(item)
            ),
            your_claimed: lostItems.filter(item =>
                item.claimStatus === 'Returned' &&
                matchesSearch(item)
            ),
        };

        const firstTabWithResults = TABS.find(tab => tabFilters[tab.key]?.length > 0);
        if (firstTabWithResults) {
            setActiveTab(firstTabWithResults.key);
            lastAutoSwitchedQuery.current = searchQuery;
        }
    }, [searchQuery, lostItems]);

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
        fetchItems();
        onClaimSuccess?.();
        setTimeout(() => setShowSuccessPopup(true), 100);
    };

    const handleTabChange = (tabKey) => {
        setActiveTab(tabKey);
        fetchItems();
    };

    const applyCategory = (items) =>
        activeCategory === null || activeCategory === "All"
            ? items
            : items.filter(item => (item.category ?? "").toLowerCase() === activeCategory.toLowerCase());

    const applySearch = (items) => {
        if (!searchQuery?.trim()) return items;
        const q = searchQuery.toLowerCase();
        return items.filter(item =>
            item.name?.toLowerCase().includes(q) ||
            item.category?.toLowerCase().includes(q) ||
            item.lastSeen?.toLowerCase().includes(q) ||
            item.additional_info?.toLowerCase().includes(q)
        );
    };

    const tabItems = {
        lost: applySearch(applyCategory(
            lostItems.filter(item =>
                item.status !== 'Returned' &&
                item.approvedClaims.length === 0 &&
                item.claimStatus !== 'Approved' &&
                item.claimStatus !== 'Returned'
            )
        )),
        other_approved: applySearch(applyCategory(
            lostItems.filter(item =>
                item.status !== 'Returned' &&
                item.approvedClaims.length > 0 &&
                item.claimStatus !== 'Approved'
            )
        )),
        other_claimed: applySearch(applyCategory(
            lostItems.filter(item =>
                item.status === 'Returned' &&
                item.claimStatus == null
            )
        )),
        your_approved: applySearch(applyCategory(
            lostItems.filter(item => item.claimStatus === 'Approved')
        )),
        your_claimed: applySearch(applyCategory(
            lostItems.filter(item => item.claimStatus === 'Returned')
        )),
    };

    const totalSearchResults = isSearching
        ? TABS.reduce((sum, tab) => sum + (tabItems[tab.key]?.length ?? 0), 0)
        : 0;

    const tabColors = {
        lost: { active: "bg-[#047EAF] text-white", dot: "bg-[#047EAF]" },
        other_approved: { active: "bg-green-500 text-white", dot: "bg-green-500" },
        other_claimed: { active: "bg-gray-400 text-white", dot: "bg-gray-400" },
        your_approved: { active: "bg-green-600 text-white", dot: "bg-green-600" },
        your_claimed: { active: "bg-yellow-400 text-white", dot: "bg-yellow-400" },
    };

    const renderGrid = (items) => {
        if (items.length === 0) return (
            <p className="montserrat text-sm text-gray-400">No items found.</p>
        );
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
                {items.map((item) => {
                    const description = `This ${item.name} was found on ${item.dateFound} and was last seen near ${item.lastSeen}.`;
                    return (
                        <ItemsCard
                            key={item.id}
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
                            pinnedIds={pinnedIds}
                            onPinChange={onPinChange}
                            approvedClaimsCount={item.approvedClaims?.length ?? 0}
                            hasCancelNotif={item.hasCancelNotif && !dismissedCancels.includes(String(item.id))}
                            onDismissCancelNotif={() => dismissCancelNotif(item.id, item.userClaimId)}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <>
            <div className="flex flex-col gap-5 mb-10">

                {isSearching && (
                    <div className="flex flex-col gap-1">
                        <p className="montserrat text-sm font-semibold text-[#047EAF]">
                            Search results for <span className="italic">"{searchQuery}"</span>
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 montserrat">
                            {TABS.map(tab => {
                                const count = tabItems[tab.key]?.length ?? 0;
                                if (count === 0) return null;
                                return (
                                    <span
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`cursor-pointer px-2 py-0.5 rounded-full border transition montserrat font-semibold
                                        ${activeTab === tab.key
                                                ? "border-[#69ADCE] text-[#69ADCE]"
                                                : "border-gray-200 text-gray-400 hover:border-[#69ADCE] hover:text-[#69ADCE]"
                                            }`}
                                    >
                                        {count} in {tab.label}
                                    </span>
                                );
                            })}
                            {totalSearchResults === 0 && (
                                <span className="text-gray-400">No results found across all tabs.</span>
                            )}
                        </div>
                    </div>
                )}

                {!isSearching && (
                    <div className="flex flex-wrap gap-2">
                        {TABS.map((tab) => {
                            const count = tabItems[tab.key]?.length ?? 0;
                            const isActive = activeTab === tab.key;
                            const colors = tabColors[tab.key];
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => handleTabChange(tab.key)}
                                    className={`montserrat text-xs font-semibold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5
                                        ${isActive
                                            ? `${colors.active} border-transparent`
                                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    {!isActive && (
                                        <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                                    )}
                                    {tab.label}
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
                                        ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {isSearching && (
                    <div className="flex flex-wrap gap-2">
                        {TABS.map((tab) => {
                            const count = tabItems[tab.key]?.length ?? 0;
                            const isActive = activeTab === tab.key;
                            const colors = tabColors[tab.key];
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => handleTabChange(tab.key)}
                                    className={`montserrat text-xs font-semibold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5
                                        ${isActive
                                            ? `${colors.active} border-transparent`
                                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    {!isActive && (
                                        <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                                    )}
                                    {tab.label}
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold
                                        ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {renderGrid(tabItems[activeTab])}
            </div>

            {selectedItem && (
                <ViewDetailsPopup
                    item={selectedItem}
                    onClose={handleViewClose}
                    onClaim={() => handleClaimClick(selectedItem)}
                    onEditClaim={() => handleEditClaim(selectedItem)}
                    claimStatus={selectedItem?.claimStatus}
                    itemStatus={selectedItem?.status}
                    returnedByName={selectedItem?.returnedByName}
                    returnedAt={selectedItem?.returnedAt}
                    approvedClaims={selectedItem?.approvedClaims}
                    hasOtherApprovedClaim={selectedItem?.hasOtherApprovedClaim}
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

export default CardLayout;