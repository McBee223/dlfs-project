import { useState, useEffect } from "react";
import NoAccountYetLayout from "./NoAccountYetLayout";
import NoAccountFoundLayout from "./NoAccountFoundLayout";
import ViewAdminDetailsPopup from "../../../ui/adminUI/popups/ViewAdminDetailsPopup";
import ViewUserDetailsPopup from "../../../ui/adminUI/popups/ViewUserDetailsPopup";

function ArchiveLayout({
    editMode,
    selectedIds = [],
    setSelectedIds,
    onTypeMapChange,
    search,
    sortLabel,
    onClear,
    onCountChange,
    onUserCountChange
}) {
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [activeMenu, setActiveMenu] = useState(null);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        fetch('${import.meta.env.VITE_API_URL}/api/admin/archive', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.users) setUsers(data.users);
                if (data.admins) setAdmins(data.admins);
            });
    }, []);

    useEffect(() => {
        if (!onTypeMapChange) return;
        const map = {};
        admins.forEach(a => { map[`admin-${a.id}`] = 'admin'; });
        users.forEach(u => { map[`user-${u.id}`] = 'user'; });
        onTypeMapChange(map);
    }, [admins, users]);

    useEffect(() => {
        function handleClickOutside(e) {
            const isMenuClick = e.target.closest("[data-popup]");
            if (!isMenuClick) setActiveMenu(null);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleRestore = async (id, type) => {
        await fetch(`${import.meta.env.VITE_API_URL}/api/admin/archive/restore/${id}?type=${type}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (type === 'admin') {
            setAdmins(prev => prev.filter(a => a.id !== id));
        } else {
            const newUsers = users.filter(u => u.id !== id);
            setUsers(newUsers);
            if (onUserCountChange) onUserCountChange(prev => prev + 1);
        }
        setActiveMenu(null);
    };

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
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            startOfWeek.setHours(0, 0, 0, 0);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);
            return itemDate >= startOfWeek && itemDate <= endOfWeek;
        }
        if (sortLabel === "This Month") {
            return itemDate.getMonth() === today.getMonth() && itemDate.getFullYear() === today.getFullYear();
        }
        if (sortLabel === "This Year") return itemDate.getFullYear() === today.getFullYear();
        return true;
    };

    const filteredAdmins = admins.filter(a =>
        (a.name || "").toLowerCase().includes((search || "").toLowerCase()) && isWithinRange(a.date)
    );
    const filteredUsers = users.filter(u =>
        (u.name || "").toLowerCase().includes((search || "").toLowerCase()) && isWithinRange(u.date)
    );

    useEffect(() => {
        if (onCountChange) onCountChange(filteredAdmins.length + filteredUsers.length);
    }, [filteredAdmins.length, filteredUsers.length]);

    const adminKeys = filteredAdmins.map(a => `admin-${a.id}`);
    const userKeys = filteredUsers.map(u => `user-${u.id}`);

    const allAdminsSelected = adminKeys.length > 0 && adminKeys.every(k => selectedIds.includes(k));
    const allUsersSelected = userKeys.length > 0 && userKeys.every(k => selectedIds.includes(k));

    const toggleSelectAllAdmins = () => {
        if (allAdminsSelected) setSelectedIds(prev => prev.filter(k => !adminKeys.includes(k)));
        else setSelectedIds(prev => [...new Set([...prev, ...adminKeys])]);
    };

    const toggleSelectAllUsers = () => {
        if (allUsersSelected) setSelectedIds(prev => prev.filter(k => !userKeys.includes(k)));
        else setSelectedIds(prev => [...new Set([...prev, ...userKeys])]);
    };

    const toggleSelect = (key) => {
        setSelectedIds(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    };

    const adminGridCols = editMode
        ? "grid-cols-[20px_100px_140px_280px_120px_150px_100px_auto]"
        : "grid-cols-[100px_150px_280px_120px_150px_100px_auto]";

    const adminGridCols2xl = editMode
        ? "2xl:grid-cols-[20px_145px_215px_390px_170px_215px_120px_auto]"
        : "2xl:grid-cols-[145px_215px_390px_170px_215px_120px_auto]";

    const userGridCols = editMode
        ? "grid-cols-[20px_152px_222px_296px_80px_103px_150px_123px_auto]"
        : "grid-cols-[152px_222px_296px_80px_103px_150px_123px_auto]";

    const userGridCols2xl = editMode
        ? "2xl:grid-cols-[20px_180px_260px_380px_95px_120px_175px_145px_auto]"
        : "2xl:grid-cols-[180px_260px_380px_95px_120px_175px_145px_auto]";

    return (
        <div className="montserrat text-sm 2xl:text-base text-[#646464] font-semibold space-y-6">

            <div>
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-[#047EAF] font-bold text-sm 2xl:text-base">Admin Accounts</span>
                    <div className="flex-1 h-px bg-[#D8D8D8]" />
                </div>
                <div className="overflow-x-auto max-w-277 2xl:max-w-410">
                    <div className={`grid ${adminGridCols} ${adminGridCols2xl} bg-[#D9EEF9] w-full p-3 2xl:p-4 rounded-sm text-[#047EAF] font-semibold`}>
                        {editMode && (
                            <div className="px-2 flex items-center">
                                <input type="checkbox" checked={allAdminsSelected} onChange={toggleSelectAllAdmins} className="accent-[#047EAF] cursor-pointer 2xl:scale-120" />
                            </div>
                        )}
                        <div className="px-2">Admin ID</div>
                        <div className="px-2">Name</div>
                        <div className="px-2">Microsoft Account</div>
                        <div className="px-2">Password</div>
                        <div className="px-2">Date Registered</div>
                        <div className="px-2">User Level</div>
                        <div className="px-2 text-center">Actions</div>
                    </div>

                    {admins.length === 0 ? (
                        <NoAccountYetLayout info="archived admins" />
                    ) : filteredAdmins.length === 0 ? (
                        <NoAccountFoundLayout onClear={onClear} />
                    ) : filteredAdmins.map(a => (
                        <div key={a.id} className={`grid ${adminGridCols} ${adminGridCols2xl} p-3 2xl:p-4 border-b border-gray-100 items-center ${editMode && selectedIds.includes(`admin-${a.id}`) ? "bg-[#EAF5FB]" : ""}`}>
                            {editMode && (
                                <div className="px-2 flex items-center">
                                    <input type="checkbox" checked={selectedIds.includes(`admin-${a.id}`)} onChange={() => toggleSelect(`admin-${a.id}`)} className="accent-[#047EAF] cursor-pointer 2xl:scale-120" />
                                </div>
                            )}
                            <div className="px-2 truncate">{a.id}</div>
                            <div className="px-2 truncate">{a.name}</div>
                            <div className="px-2 truncate">{a.microsoftaccount}</div>
                            <div className="px-2 truncate">{"********"}</div>
                            <div className="px-2 truncate">{a.date}</div>
                            <div className="px-2">
                                <span className="bg-[#FFF6D4] text-[#FFCC00] px-3 py-1 2xl:px-4 2xl:py-1.5 rounded-lg text-xs 2xl:text-sm inline-block truncate max-w-full">{a.role}</span>
                            </div>
                            <div className="px-2 flex justify-center relative items-center">
                                <button onClick={() => setActiveMenu(activeMenu === `admin-${a.id}` ? null : `admin-${a.id}`)} className="text-lg 2xl:text-xl font-bold">•••</button>
                                {activeMenu === `admin-${a.id}` && (
                                    <div data-popup="true" className="absolute right-2 2xl:right-20 -top-10 2xl:-top-16 bg-white shadow-md border border-[#646464] rounded-md w-44 2xl:w-48 z-50">
                                        <button data-popup="true" onClick={() => { setSelectedAdmin(a); setActiveMenu(null); }} className="text-[#646464] w-full px-3 py-2 2xl:px-4 2xl:py-3 hover:bg-gray-100 rounded-md text-left text-sm 2xl:text-base">View Admin Detail</button>
                                        <button data-popup="true" onClick={() => handleRestore(a.id, 'admin')} className="text-[#047EAF] w-full px-3 py-2 2xl:px-4 2xl:py-3 hover:bg-gray-100 rounded-md text-left text-sm 2xl:text-base">Restore Account</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-[#047EAF] font-bold text-sm 2xl:text-base">User Accounts</span>
                    <div className="flex-1 h-px bg-[#D8D8D8]" />
                </div>
                <div className="overflow-x-auto max-w-277 2xl:max-w-410">
                    <div className={`grid ${userGridCols} ${userGridCols2xl} bg-[#D9EEF9] w-full p-3 2xl:p-4 rounded-sm text-[#047EAF] font-semibold`}>
                        {editMode && (
                            <div className="px-2 flex items-center">
                                <input type="checkbox" checked={allUsersSelected} onChange={toggleSelectAllUsers} className="accent-[#047EAF] cursor-pointer 2xl:scale-120" />
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
                        <NoAccountYetLayout info="archived users" />
                    ) : filteredUsers.length === 0 ? (
                        <NoAccountFoundLayout onClear={onClear} />
                    ) : filteredUsers.map(u => (
                        <div key={u.id} className={`grid ${userGridCols} ${userGridCols2xl} p-3 2xl:p-4 border-b border-gray-100 items-start ${editMode && selectedIds.includes(`user-${u.id}`) ? "bg-[#EAF5FB]" : ""}`}>
                            {editMode && (
                                <div className="px-2 flex items-center">
                                    <input type="checkbox" checked={selectedIds.includes(`user-${u.id}`)} onChange={() => toggleSelect(`user-${u.id}`)} className="mt-0.5 2xl:mt-1 accent-[#047EAF] cursor-pointer 2xl:scale-120" />
                                </div>
                            )}
                            <div className="px-2 truncate">{u.id}</div>
                            <div className="px-2 truncate">{u.name}</div>
                            <div className="px-2 truncate">{u.microsoftaccount}</div>
                            <div className="px-2 truncate">{u.section}</div>
                            <div className="px-2 truncate">{"********"}</div>
                            <div className="px-2 truncate">{u.date}</div>
                            <div className="px-2">
                                <span className="bg-[#FFF6D4] text-[#FFCC00] px-3 py-1 2xl:px-4 2xl:py-1.5 rounded-lg text-xs 2xl:text-sm inline-block truncate max-w-full">{u.role}</span>
                            </div>
                            <div className="px-2 flex justify-center relative items-start">
                                <button onClick={() => setActiveMenu(activeMenu === `user-${u.id}` ? null : `user-${u.id}`)} className={`flex items-center justify-center text-lg 2xl:text-xl font-bold w-full ${editMode ? "ml-9 2xl:ml-4" : "ml-12 2xl:ml-4"}`}>•••</button>
                                {activeMenu === `user-${u.id}` && (
                                    <div data-popup="true" className="absolute -right-7 2xl:right-7 -top-10 2xl:-top-16 bg-white shadow-md border border-[#646464] rounded-md w-44 2xl:w-48 z-50">
                                        <button data-popup="true" onClick={() => { setSelectedUser(u); setActiveMenu(null); }} className="text-[#646464] w-full px-3 py-2 2xl:px-4 2xl:py-3 hover:bg-gray-100 rounded-md text-left text-sm 2xl:text-base">View User Detail</button>
                                        <button data-popup="true" onClick={() => handleRestore(u.id, 'user')} className="text-[#047EAF] w-full px-3 py-2 2xl:px-4 2xl:py-3 hover:bg-gray-100 rounded-md text-left text-sm 2xl:text-base">Restore Account</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedAdmin && (
                <ViewAdminDetailsPopup admin={selectedAdmin} readOnly={true} onClose={() => setSelectedAdmin(null)} onUpdate={() => setSelectedAdmin(null)} />
            )}
            {selectedUser && (
                <ViewUserDetailsPopup user={selectedUser} readOnly={true} onClose={() => setSelectedUser(null)} onUpdate={() => setSelectedUser(null)} />
            )}
        </div>
    );
}

export default ArchiveLayout;