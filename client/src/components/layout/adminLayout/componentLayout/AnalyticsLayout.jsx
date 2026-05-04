import { useState, useEffect } from "react";
import TotalLostItemsCard from "../../../ui/adminUI/cards/TotalLostItemsCard";
import TotalClaimsRequestCard from "../../../ui/adminUI/cards/TotalClaimsRequestCard";
import TotalReturnedItemsCard from "../../../ui/adminUI/cards/TotalReturnedItemsCard";
import TotalUsersCard from "../../../ui/adminUI/cards/TotalUsersCard";
import CalendarCard from "../../../ui/adminUI/cards/CalendarCard ";

function AnalyticsLayout({ userCount }) {
    const [claimsCount, setClaimsCount] = useState(0);

    useEffect(() => {
        const fetchClaims = () => {
            const token = localStorage.getItem("adminToken");
            fetch("http://localhost:3000/api/admin/claims/count", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => setClaimsCount(data.count))
                .catch(err => console.error("Failed to fetch claims count:", err));
        };

        fetchClaims();
        const interval = setInterval(fetchClaims, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="montserrat w-full flex h-full overflow-hidden">
            <div className="flex gap-2 flex-1 mt-2 mx-2">
                <div className="flex flex-col gap-2 flex-1">
                    <TotalLostItemsCard />
                    <TotalReturnedItemsCard />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                    <TotalClaimsRequestCard count={claimsCount} />
                    <TotalUsersCard count={userCount} />
                </div>
            </div>
            <div className="w-64">
                <CalendarCard width="62" />
            </div>
        </div>
    );
}

export default AnalyticsLayout;