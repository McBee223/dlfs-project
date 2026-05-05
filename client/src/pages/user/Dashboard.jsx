import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TopBar from "../../components/layout/userLayout/fixedLayout/TopBar";
import RightBar from "../../components/layout/userLayout/fixedLayout/RightBar";
import DashboardMainLayout from "../../components/layout/userLayout/mainLayouts/DashboardMainLayout";

function Dashboard() {
    const [pinnedCount, setPinnedCount] = useState(0);
    const [claimedCount, setClaimedCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();

    useEffect(() => {
        if (location.state?.searchQuery !== undefined) {
            setSearchQuery(location.state.searchQuery);
        }
    }, [location.state]);

    return (
        <>
            <TopBar title="DASHBOARD" bg="" iconbg="bg-[#F9F9F9]" />
            <div className="flex flex-1">
                <DashboardMainLayout
                    onPinnedCountChange={setPinnedCount}
                    onClaimedCountChange={setClaimedCount}
                    searchQuery={searchQuery}
                />
                <RightBar pinnedCount={pinnedCount} claimedCount={claimedCount} />
            </div>
        </>
    );
}

export default Dashboard;



