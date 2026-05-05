import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authFetch } from "../utils/authFetch";

const ProfileContext = createContext();

export function ProfileProvider({ children, role }) {
    const [profileImg, setProfileImg] = useState(null);
    const [name, setName] = useState("Loading...");
    const [gender, setGender] = useState("");
    const [contact, setContact] = useState("");
    const [microsoftaccount, setMicrosoftaccount] = useState("");

    const tokenKey = role === "admin" ? "adminToken" : "userToken";
    const apiBase = role === "admin"
        ? "${import.meta.env.VITE_API_URL}/api/admin/profile"
        : "${import.meta.env.VITE_API_URL}/api/user/profile";

    const fetchProfile = useCallback(() => {
        const token = localStorage.getItem(tokenKey);
        if (!token) return;

        const fetcher = role === "admin" ? fetch : authFetch;

        fetcher(apiBase, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (!data.user) return;
                setName(data.user.name || "");
                setGender(data.user.gender || "");
                setContact(data.user.contact || "");
                setMicrosoftaccount(data.user.microsoftaccount || "");
                if (data.user.profile_image) setProfileImg(data.user.profile_image);
            })
            .catch(() => {});
    }, [apiBase, tokenKey]);

    useEffect(() => {
        fetchProfile();
        const interval = setInterval(fetchProfile, 3000);
        return () => clearInterval(interval);
    }, [fetchProfile]);

    return (
        <ProfileContext.Provider value={{
            profileImg, setProfileImg,
            name, setName,
            gender, setGender,
            contact, setContact,
            microsoftaccount,
            fetchProfile
        }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    return useContext(ProfileContext);
}

