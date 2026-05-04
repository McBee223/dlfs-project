import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../../../context/ProfileContext";
import { useAdminNotifications } from "../../../../context/AdminNotificationContext";

import AdminNotificationPopup from "../../../ui/adminUI/popups/AdminNotificationPopup";
import AddItemPopup from "../../../ui/adminUI/popups/AddItemPopup";

import ProfileImage2 from "../../../../assets/images/ProfileImage2.png";
import AddItemButton from "../../../../assets/images/AddItemButton.png";
import SearchIcon from "../../../../assets/icons/SearchIcon.svg";
import NotifIcon from "../../../../assets/icons/NotifIcon.svg";

function TopBar({ title, bg, iconbg, margin, showActions }) {
    const navigate = useNavigate();

    const [notifOpen, setNotifOpen] = useState(false);
    const [addItemOpen, setAddItemOpen] = useState(false);
    const [lostItemsCount, setLostItemsCount] = useState(0);

    const { profileImg } = useProfile();
    const { unreadCount, markAllAsSeen } = useAdminNotifications();

    const notifRef = useRef(null);

    const fetchLostItemsCount = () => {
        const token = localStorage.getItem("adminToken");
        fetch("http://localhost:3000/api/admin/lost-items", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.items) setLostItemsCount(data.items.length);
            })
            .catch(err => console.error("Failed to fetch lost items count:", err));
    };

    const handleOpenAddItem = () => {
        fetchLostItemsCount();
        setAddItemOpen(true);
    };

    const toggleNotif = () => {
        const opening = !notifOpen;
        setNotifOpen(opening);
        if (opening) markAllAsSeen();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`h-14 px-4 py-4 flex items-center justify-between shrink-0 mt-2 bg-${bg} rounded-xl mr-2 mx-${margin}`}>
            <h1 className="montserrat text-2xl font-semibold text-[#000000]">
                {title}
            </h1>

            <div className="flex items-center gap-4">
                {showActions && (
                    <div className={`rounded-full px-4 py-2 flex items-center gap-2 w-64 ${iconbg}`}>
                        <img src={SearchIcon} alt="search" className="w-5 h-5 opacity-60" />
                        <input
                            type="text"
                            placeholder="Search your item"
                            className="bg-transparent outline-none text-xs text-[#646464] w-full"
                        />
                    </div>
                )}

                <div ref={notifRef} className="relative">
                    <button
                        onClick={toggleNotif}
                        className={`p-2 rounded-full flex items-center justify-center transition ${notifOpen ? "bg-[#047EAF]" : `${iconbg}`}`}
                    >
                        <img
                            src={NotifIcon}
                            alt="notification"
                            className={`w-5 h-5 ${notifOpen ? "brightness-0 invert" : ""}`}
                        />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border border-white" />
                        )}
                    </button>
                    {notifOpen && <AdminNotificationPopup />}
                </div>

                {showActions && (
                    <button onClick={handleOpenAddItem}>
                        <img
                            src={AddItemButton}
                            alt=""
                            className="w-25 h-auto transition-transform duration-300 ease-out hover:scale-105 cursor-pointer"
                        />
                    </button>
                )}

                {!showActions && (
                    <span className="w-px h-6 bg-gray-300"></span>
                )}

                <img
                    src={profileImg || ProfileImage2}
                    alt="profile"
                    onClick={() => navigate("/admin/profile")}
                    className="w-9 h-9 rounded-full object-cover cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
                />
            </div>

            {addItemOpen && (
                <AddItemPopup
                    onClose={() => setAddItemOpen(false)}
                    onSuccess={() => {
                        setAddItemOpen(false);
                        navigate("/admin/items_management/lost");
                    }}
                />
            )}
        </div>
    );
}

export default TopBar;