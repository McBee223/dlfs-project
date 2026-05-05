import { useState } from "react";
import AnalyticsLayout from "../componentLayout/AnalyticsLayout";
import AccountsLayout from "../componentLayout/AccountsLayout";

function AdminDashboardMainLayout() {
    const [userCount, setUserCount] = useState(null);

    return (
        <div className="flex-1 w-full">
            <div>
                <AnalyticsLayout userCount={userCount} />
                <div className="w-full my-2">
                    <AccountsLayout onUserCountChange={setUserCount} />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboardMainLayout;

