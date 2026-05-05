import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProfile } from "../../../../context/ProfileContext";
import { useNotifications } from "../../../../context/NotificationContext";

import NotificationPopUp from "../../../ui/userUI/popups/NotificationPopup";
import ChatPopup from "../../../ui/userUI/popups/ChatPopup";

import ProfileImage2 from "../../../../assets/images/ProfileImage2.png";
import SearchIcon from "../../../../assets/icons/SearchIcon.svg";
import NotifIcon from "../../../../assets/icons/NotifIcon.svg";
import ChatIcon from "../../../../assets/icons/ChatIcon.svg";

function TopBar({ title, bg, iconbg }) {
    const navigate = useNavigate();
    const location = useLocation();
    const isDashboard = location.pathname === "/user/dashboard";

    const [notifOpen, setNotifOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const { profileImg, name } = useProfile();
    const { unreadCount, markAllAsSeen } = useNotifications();

    const notifRef = useRef(null);
    const chatRef = useRef(null);

    const toggleNotif = () => {
        const opening = !notifOpen;
        setNotifOpen(opening);
        if (opening) markAllAsSeen();
    };

    const toggleChat = () => setChatOpen(!chatOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setNotifOpen(false);
            }
            if (chatRef.current && !chatRef.current.contains(event.target)) {
                setChatOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (isDashboard && location.state?.searchQuery !== undefined) {
            setSearchValue(location.state.searchQuery);
        }
    }, [location.state]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        if (isDashboard) {
            navigate("/user/dashboard", { state: { searchQuery: value }, replace: true });
        }
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter" && !isDashboard && searchValue.trim()) {
            navigate("/user/dashboard", { state: { searchQuery: searchValue } });
        }
    };

    const handleClearSearch = () => {
        setSearchValue("");
        navigate("/user/dashboard", { state: { searchQuery: "" }, replace: true });
    };

    return (
        <div className={`h-14 px-4 py-4 flex items-center justify-between shrink-0 my-2 mx-2 2xl:mr-3 bg-${bg}`}>
            <h1 className="montserrat text-2xl 2xl:text-3xl font-semibold text-[#000000]">
                {title}
            </h1>

            <div className="flex items-center gap-4">
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
                    {isDashboard && searchValue && (
                        <button
                            onClick={handleClearSearch}
                            className="text-gray-400 hover:text-[#047EAF] text-sm 2xl:text-base font-bold transition"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div ref={notifRef} className="relative">
                    <button
                        onClick={toggleNotif}
                        className={`p-2 rounded-full flex items-center justify-center transition
                        ${notifOpen ? "bg-[#047EAF]" : `${iconbg}`}`}
                    >
                        <img
                            src={NotifIcon}
                            alt="notification"
                            className={`w-5 h-5 2xl:w-6 2xl:h-6  ${notifOpen ? "brightness-0 invert" : ""}`}
                        />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 2xl:w-2.5 2xl:h-2.5 bg-blue-500 rounded-full border border-white" />
                        )}
                    </button>
                    {notifOpen && <NotificationPopUp />}
                </div>

                <div ref={chatRef} className="relative">
                    <button
                        onClick={toggleChat}
                        className={`p-2 rounded-full flex items-center justify-center transition
                        ${chatOpen ? "bg-[#047EAF]" : `${iconbg}`}`}
                    >
                        <img src={ChatIcon} alt="chat"
                            className={`w-5 h-5 2xl:w-6 2xl:h-6 ${chatOpen ? "brightness-0 invert" : ""}`} />
                    </button>
                    {chatOpen && <ChatPopup onClose={() => setChatOpen(false)} />}
                </div>

                <span className="w-px h-6 2xl:h-7 bg-gray-300"></span>

                <div className="flex items-center gap-2">
                    <img
                        src={profileImg || ProfileImage2}
                        className="w-8 h-8 2xl:w-9 2xl:h-9 rounded-full object-cover"
                        alt="profile"
                    />
                    <span
                        onClick={() => navigate("/user/profile")}
                        className="montserrat font-semibold text-sm cursor-pointer"
                    >
                        {name?.replace('|', ' ')}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default TopBar;  

