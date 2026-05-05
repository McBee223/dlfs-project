import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { authFetch } from "../../../../utils/authFetch";
import Carousell from "../../../ui/userUI/Carousell";
import FilterNavigateLayout from "../componentLayout/FilterNavigateLayout";
import PinnedNavigateLayout from "../componentLayout/PinnedNavigateLayout";
import CardLayout from "../componentLayout/CardLayout";

function DashboardMainLayout({ onPinnedCountChange, onClaimedCountChange, searchQuery }) {
    const [pinnedItems, setPinnedItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [dismissedCancels, setDismissedCancels] = useState(() => {
        const stored = localStorage.getItem("dismissedCancelNotifs");
        return stored ? JSON.parse(stored) : [];
    });

    const scrollRef = useRef(null);
    const location = useLocation();
    const cardSectionRef = useRef(null);
    const isSearching = searchQuery?.trim().length > 0;

    useEffect(() => {
        if (location.state?.category) {
            setActiveCategory(location.state.category);
            setTimeout(() => {
                cardSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 300);
        }
    }, [location.state]);

    const clearReactivatedNotifs = useCallback((items) => {
        const reactivatedIds = items
            .filter(item => item.has_cancel_notif === 1 || item.has_cancel_notif === true)
            .map(item => String(item.id));

        if (reactivatedIds.length === 0) return;

        setDismissedCancels(prev => {
            const updated = prev.filter(id => !reactivatedIds.includes(id));
            if (updated.length !== prev.length) {
                localStorage.setItem("dismissedCancelNotifs", JSON.stringify(updated));
            }
            return updated;
        });
    }, []);

    const fetchPinnedItems = useCallback(() => {
        const token = localStorage.getItem("userToken");
        authFetch(`${import.meta.env.VITE_API_URL}/api/user/pinned-items`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (data.items) {
                    clearReactivatedNotifs(data.items);
                    const mapped = data.items.map(item => ({
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
                    setPinnedItems(mapped);
                    onPinnedCountChange?.(mapped.length);
                }
            })
            .catch(err => console.error("Failed to fetch pinned items:", err));
    }, [onPinnedCountChange, clearReactivatedNotifs]);

    useEffect(() => {
        fetchPinnedItems();
        const interval = setInterval(fetchPinnedItems, 5000);
        return () => clearInterval(interval);
    }, [fetchPinnedItems]);

    const fetchClaimedCount = useCallback(() => {
        const token = localStorage.getItem("userToken");
        authFetch(`${import.meta.env.VITE_API_URL}/api/user/item-status`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.items) onClaimedCountChange?.(data.items.length);
            })
            .catch(err => console.error("Failed to fetch claimed count:", err));
    }, [onClaimedCountChange]);

    useEffect(() => {
        fetchClaimedCount();
    }, [fetchClaimedCount]);

    const dismissCancelNotif = useCallback((itemId, claimId) => {
        setDismissedCancels(prev => {
            if (prev.includes(String(itemId))) return prev;
            const updated = [...prev, String(itemId)];
            localStorage.setItem("dismissedCancelNotifs", JSON.stringify(updated));
            return updated;
        });

        if (claimId) {
            const token = localStorage.getItem("userToken");
            authFetch(`${import.meta.env.VITE_API_URL}/api/user/claims/${claimId}/dismiss-cancel-notif`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            }).catch(err => console.error('Failed to dismiss notif:', err));
        }
    }, []);

    return (
        <div className="flex-1 ml-6 w-200">
            <div>
                {!isSearching && <Carousell />}
                <div className="w-full">
                    {!isSearching && pinnedItems.length > 0 && (
                        <PinnedNavigateLayout
                            pinnedItems={pinnedItems}
                            scrollRef={scrollRef}
                            onUnpin={fetchPinnedItems}
                            dismissedCancels={dismissedCancels}
                            onDismissCancelNotif={dismissCancelNotif}
                        />
                    )}
                    <div ref={cardSectionRef}>
                        {!isSearching && (
                            <FilterNavigateLayout
                                activeCategory={activeCategory}
                                onCategoryChange={setActiveCategory}
                            />
                        )}
                        <CardLayout
                            pinnedIds={pinnedItems.map(i => String(i.id))}
                            onPinChange={fetchPinnedItems}
                            onClaimSuccess={fetchClaimedCount}
                            activeCategory={activeCategory}
                            searchQuery={searchQuery}
                            dismissedCancels={dismissedCancels}
                            onDismissCancelNotif={dismissCancelNotif}
                            onReactivateNotifs={clearReactivatedNotifs}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardMainLayout;