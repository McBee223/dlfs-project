import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/lost-items`, {
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

    const location = useLocation();
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        if (location.state?.searchQuery !== undefined) {
            setSearchValue(location.state.searchQuery);
        }
    }, [location.state]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        if (location.pathname === "/admin/items_management/lost") {
            navigate("/admin/items_management/lost", { state: { searchQuery: value }, replace: true });
        }
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter" && searchValue.trim()) {
            navigate("/admin/items_management/lost", { state: { searchQuery: searchValue } });
        }
    };

    const handleClearSearch = () => {
        setSearchValue("");
        navigate("/admin/items_management/lost", { state: { searchQuery: "" }, replace: true });
    };

    return (
        <div className={`h-14 px-4 py-4 2xl:p-5 flex items-center justify-between shrink-0 mt-2 bg-${bg} rounded-xl mr-2 mx-${margin}`}>
            <h1 className="montserrat text-2xl 2xl:text-3xl font-semibold text-[#000000]">
                {title}
            </h1>

            <div className="flex items-center gap-4">
                {showActions && (
                    <div className={`rounded-full px-4 py-2 flex items-center gap-2 w-64 ${iconbg}`}>
                        <img src={SearchIcon} alt="search" className="w-5 h-5 2xl:w-6 2xl:h-6 opacity-60" />
                        <input
                            type="text"
                            placeholder="Search your item"
                            className="bg-transparent outline-none text-xs 2xl:text-sm text-[#646464] w-full"
                            value={searchValue}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchKeyDown}
                        />
                        {searchValue && (
                            <button
                                onClick={handleClearSearch}
                                className="text-gray-400 hover:text-[#047EAF] text-sm 2xl:text-base font-bold transition"
                            >
                                ✕
                            </button>
                        )}
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
                            className={`w-5 h-5 2xl:w-6 2xl:h-6 ${notifOpen ? "brightness-0 invert" : ""}`}
                        />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 2xl:w-2.5 2xl:h-2.5 bg-blue-500 rounded-full border border-white" />
                        )}
                    </button>
                    {notifOpen && <AdminNotificationPopup />}
                </div>

                {showActions && (
                    <button onClick={handleOpenAddItem}>
                        <img
                            src={AddItemButton}
                            alt=""
                            className="w-25 2xl:w-27 h-auto transition-transform duration-300 ease-out hover:scale-105 cursor-pointer"
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
                    className="w-9 h-9 2xl:w-10 2xl:h-10 rounded-full object-cover cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
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