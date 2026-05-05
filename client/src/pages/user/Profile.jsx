import { useState, useEffect } from "react";
import { authFetch } from "../../utils/authFetch";
import TopBar from "../../components/layout/userLayout/fixedLayout/TopBar";
import RightBar from "../../components/layout/userLayout/fixedLayout/RightBar";
import ProfileMainLayout from "../../components/layout/userLayout/mainLayouts/ProfileMainLayout";

function Profile() {
    const [pinnedCount, setPinnedCount] = useState(0);
    const [claimedCount, setClaimedCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem("userToken");

        authFetch(`${import.meta.env.VITE_API_URL}/api/user/pinned-items`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.items) setPinnedCount(data.items.length);
            })
            .catch(err => console.error("Failed to fetch pinned count:", err));

        authFetch(`${import.meta.env.VITE_API_URL}/api/user/item-status`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.items) setClaimedCount(data.items.length);
            })
            .catch(err => console.error("Failed to fetch claimed count:", err));
    }, []);

    return (
        <>
            <TopBar title="My Account" bg="" iconbg="bg-[#F9F9F9]" />
            <div className="flex flex-1">
                <ProfileMainLayout />
                <RightBar pinnedCount={pinnedCount} claimedCount={claimedCount} />
            </div>
        </>
    );
}

export default Profile;


