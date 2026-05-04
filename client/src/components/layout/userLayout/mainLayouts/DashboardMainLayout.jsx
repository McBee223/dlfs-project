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

    const fetchPinnedItems = useCallback(() => {
        const token = localStorage.getItem("userToken");
        authFetch("http://localhost:3000/api/user/pinned-items", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (data.items) {
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
                    }));
                    setPinnedItems(mapped);
                    onPinnedCountChange?.(mapped.length);
                }
            })
            .catch(err => console.error("Failed to fetch pinned items:", err));
    }, [onPinnedCountChange]);

    useEffect(() => {
        fetchPinnedItems();
        const interval = setInterval(fetchPinnedItems, 5000);
        return () => clearInterval(interval);
    }, [fetchPinnedItems]);

    const fetchClaimedCount = useCallback(() => {
        const token = localStorage.getItem("userToken");
        authFetch("http://localhost:3000/api/user/item-status", {
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
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardMainLayout;