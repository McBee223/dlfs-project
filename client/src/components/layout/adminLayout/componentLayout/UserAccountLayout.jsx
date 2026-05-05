import { useState, useEffect } from "react";
import ViewUserDetailsPopup from "../../../ui/adminUI/popups/ViewUserDetailsPopup";
import NoAccountFoundLayout from "./NoAccountFoundLayout";
import NoAccountYetLayout from "./NoAccountYetLayout"

function UserAccountLayout({
    editMode,
    selectedIds = [],
    setSelectedIds,
    search,
    sortLabel,
    onClear,
    onCountChange
}) {
    const [activeMenu, setActiveMenu] = useState(null);
    const [showPassword, setShowPassword] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const token = localStorage.getItem('adminToken');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.users) setUsers(data.users);
            });
    }, []);

    const parseDate = (dateStr) => {
        if (!dateStr) return null;
        let parts;
        if (dateStr.includes("/")) parts = dateStr.split("/");
        else if (dateStr.includes("-")) parts = dateStr.split("-");
        else return null;
        let [month, day, year] = parts;
        if (!year) return null;
        if (year.length === 2) year = Number(year) < 50 ? "20" + year : "19" + year;
        return new Date(year, month - 1, day);
    };

    const isWithinRange = (dateStr) => {
        if (!sortLabel || sortLabel === "All Time") return true;
        const itemDate = parseDate(dateStr);
        if (!itemDate) return true;
        const today = new Date();
        if (sortLabel === "This Week") {
            const start = new Date(today);
            start.setDate(today.getDate() - today.getDay());
            start.setHours(0, 0, 0, 0);
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            return itemDate >= start && itemDate <= end;
        }
        if (sortLabel === "This Month") {
            return itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
        }
        if (sortLabel === "This Year") return itemDate.getFullYear() === today.getFullYear();
        return true;
    };

    const filteredData = users.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes((search || "").toLowerCase());
        const matchesDate = isWithinRange(item.date);
        return matchesSearch && matchesDate;
    });

    useEffect(() => {
        if (onCountChange) onCountChange(filteredData.length);
    }, [filteredData.length]);

    useEffect(() => {
        function handleClickOutside(e) {
            const isMenuClick = e.target.closest("[data-popup]");
            if (!isMenuClick) {
                setActiveMenu(null);
                setShowPassword(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleSelect = (id) => {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };

    const allSelected = users.length > 0 && users.every((u) => selectedIds.includes(u.id));

    const toggleSelectAll = () => {
        if (allSelected) setSelectedIds([]);
        else setSelectedIds(users.map((u) => u.id));
    };

    const gridCols = editMode
        ? "grid-cols-[20px_152px_222px_296px_80px_103px_150px_123px_auto]"
        : "grid-cols-[152px_222px_296px_80px_103px_150px_123px_auto]";

    const gridCols2xl = editMode
        ? "2xl:grid-cols-[20px_180px_260px_380px_95px_120px_175px_145px_auto]"
        : "2xl:grid-cols-[180px_260px_380px_95px_120px_175px_145px_auto]";

    return (
        <div className="2xl:w-full montserrat text-sm 2xl:text-base text-[#646464] font-semibold">
            <div className="w-full">
                <div className="overflow-x-auto max-w-277 2xl:max-w-410">
                    <div className={`grid ${gridCols} ${gridCols2xl} bg-[#D9EEF9] w-7xl 2xl:w-410 p-3 pr-3 2xl:p-4 rounded-sm text-[#047EAF] font-semibold mr-0 2xl:mr-0`}>
                        {editMode && (
                            <div className="px-2 flex items-center">
                                <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="2xl:scale-120 accent-[#047EAF] cursor-pointer" />
                            </div>
                        )}
                        <div className="px-2">Student Number</div>
                        <div className="px-2">Name</div>
                        <div className="px-2">Microsoft Account</div>
                        <div className="px-2">Section</div>
                        <div className="px-2">Password</div>
                        <div className="px-2">Date Registered</div>
                        <div className="px-2">User Level</div>
                        <div className="px-2 text-center">Actions</div>
                    </div>

                    {users.length === 0 ? (
                        <NoAccountYetLayout info="users" />
                    ) : filteredData.length === 0 ? (
                        <NoAccountFoundLayout onClear={onClear} />
                    ) : filteredData.map((u) => (
                        <div
                            key={u.id}
                            className={`grid ${gridCols} ${gridCols2xl} p-3 2xl:p-4 border-b border-gray-100 items-start mr-4 ${editMode && selectedIds.includes(u.id) ? "bg-[#EAF5FB]" : ""}`}
                        >
                            {editMode && (
                                <div className="px-2 flex items-center">
                                    <input type="checkbox" checked={selectedIds.includes(u.id)} onChange={() => toggleSelect(u.id)} className="mt-0.5 2xl:mt-1 2xl:scale-120 accent-[#047EAF] cursor-pointer" />
                                </div>
                            )}
                            <div className="px-2 truncate">{u.id}</div>
                            <div className="px-2 truncate">{u.name?.replace(/\|/g, ' ')}</div>
                            <div className="px-2 truncate">{u.microsoftaccount}</div>
                            <div className="px-2 truncate">{u.section}</div>
                            <div className="px-2 truncate">{showPassword === u.id ? u.password : "********"}</div>
                            <div className="px-2 truncate">{u.date}</div>
                            <div className="px-2">
                                <span className="bg-[#FFF6D4] text-[#FFCC00] px-3 py-1 2xl:px-4 2xl:py-1.5 rounded-lg text-xs 2xl:text-sm">{u.role}</span>
                            </div>
                            <div className="px-2 flex justify-center relative items-start">
                                <button
                                    onClick={() => setActiveMenu(activeMenu === u.id ? null : u.id)}
                                    className={`flex items-center justify-center text-lg 2xl:text-xl font-bold w-full ${editMode ? "ml-9 2xl:ml-4" : "ml-12 2xl:ml-4"}`}
                                >
                                    •••
                                </button>
                                {activeMenu === u.id && (
                                    <div data-popup="true" className="absolute -right-7 2xl:right-3 -top-9 2xl:-top-11 bg-white shadow-md border border-[#646464] rounded-md w-40 2xl:w-48 z-20">
                                        <button data-popup="true" onClick={() => { setSelectedUser(u); setActiveMenu(null); }} className="text-[#646464] w-full px-3 py-2 2xl:px-4 2xl:py-3 hover:bg-gray-100 hover:rounded-md text-left text-sm 2xl:text-base">
                                            View User Detail
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedUser && (
                <ViewUserDetailsPopup
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onUpdate={(updatedUser) => {
                        setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, ...updatedUser } : u));
                        setSelectedUser(null);
                    }}
                />
            )}
        </div>
    );
}

export default UserAccountLayout;




