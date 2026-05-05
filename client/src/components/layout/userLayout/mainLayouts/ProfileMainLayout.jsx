import { useEffect } from "react";
import { authFetch } from "../../../../utils/authFetch";
import ProfileDetails from "../../../ui/userUI/ProfileDetails";
import PersonalInformation from "../../../ui/userUI/PersonalInformation";

function ProfileMainLayout({ onPinnedCountChange }) {

    useEffect(() => {
        const token = localStorage.getItem("userToken");

        authfetch(`${import.meta.env.VITE_API_URL}/api/user/pinned-items`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.items) {
                    onPinnedCountChange?.(data.items.length);
                }
            })
            .catch(err => console.error("Failed to fetch pinned items:", err));
    }, []);

    return (
        <div className="flex-1 ml-6 w-200">
            <div>
                <ProfileDetails />
                <div className="w-full my-2">
                    <PersonalInformation />
                </div>
            </div>
        </div>
    );
}

export default ProfileMainLayout;