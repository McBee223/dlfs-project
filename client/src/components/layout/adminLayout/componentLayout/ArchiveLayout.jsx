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
        fetch('http://localhost:3000/api/admin/archive', {
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
        admins.forEach(a => { map[a.id] = 'admin'; });
        users.forEach(u => { map[u.id] = 'user'; });
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
        await fetch(`http://localhost:3000/api/admin/archive/restore/${id}?type=${type}`, {
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

    const adminIds = filteredAdmins.map(a => a.id);
    const userIds = filteredUsers.map(u => u.id);

    const allAdminsSelected = adminIds.length > 0 && adminIds.every(id => selectedIds.includes(id));
    const allUsersSelected = userIds.length > 0 && userIds.every(id => selectedIds.includes(id));

    const toggleSelectAllAdmins = () => {
        if (allAdminsSelected) setSelectedIds(prev => prev.filter(id => !adminIds.includes(id)));
        else setSelectedIds(prev => [...new Set([...prev, ...adminIds])]);
    };

    const toggleSelectAllUsers = () => {
        if (allUsersSelected) setSelectedIds(prev => prev.filter(id => !userIds.includes(id)));
        else setSelectedIds(prev => [...new Set([...prev, ...userIds])]);
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <div className="montserrat text-sm text-[#646464] font-semibold space-y-6">

            <div>
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-[#047EAF] font-bold text-sm">Admin Accounts</span>
                    <div className="flex-1 h-px bg-[#D8D8D8]" />
                </div>
                <div className="overflow-x-auto">
                    <div className={`grid ${editMode ? "grid-cols-[auto_1fr_1.8fr_2.2fr_1fr_1.2fr_1fr_auto]" : "grid-cols-[1fr_1.8fr_2.2fr_1fr_1.2fr_1fr_auto]"} bg-[#D9EEF9] p-3 rounded-sm text-[#047EAF] font-semibold min-w-max`}>
                        {editMode && (
                            <div className="px-2 flex items-center">
                                <input type="checkbox" checked={allAdminsSelected} onChange={toggleSelectAllAdmins} className="w-4 h-4 accent-[#047EAF] cursor-pointer" />
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
                        <div key={a.id} className={`grid ${editMode ? "grid-cols-[auto_1fr_1.8fr_2.2fr_1fr_1.2fr_1fr_auto]" : "grid-cols-[1fr_1.8fr_2.2fr_1fr_1.2fr_1fr_auto]"} p-3 border-b border-gray-100 items-center min-w-max ${editMode && selectedIds.includes(a.id) ? "bg-[#EAF5FB]" : ""}`}>
                            {editMode && (
                                <div className="px-2 flex items-center">
                                    <input type="checkbox" checked={selectedIds.includes(a.id)} onChange={() => toggleSelect(a.id)} className="w-4 h-4 accent-[#047EAF] cursor-pointer" />
                                </div>
                            )}
                            <div className="px-2 truncate">{a.id}</div>
                            <div className="px-2 truncate">{a.name}</div>
                            <div className="px-2 truncate">{a.microsoftaccount}</div>
                            <div className="px-2 truncate">{"********"}</div>
                            <div className="px-2 truncate">{a.date}</div>
                            <div className="px-2">
                                <span className="bg-[#FFF6D4] text-[#FFCC00] px-3 py-1 rounded-lg text-xs inline-block truncate max-w-full">{a.role}</span>
                            </div>
                            <div className="px-2 flex justify-center relative w-20">
                                <button onClick={() => setActiveMenu(activeMenu === `admin-${a.id}` ? null : `admin-${a.id}`)} className="text-lg font-bold">•••</button>
                                {activeMenu === `admin-${a.id}` && (
                                    <div data-popup="true" className="absolute right-0 -top-10 bg-white shadow-md border border-[#646464] rounded-md w-44 z-50">
                                        <button data-popup="true" onClick={() => { setSelectedAdmin(a); setActiveMenu(null); }} className="text-[#646464] w-full px-3 py-2 hover:bg-gray-100 rounded-md text-left">View Admin Detail</button>
                                        <button data-popup="true" onClick={() => handleRestore(a.id, 'admin')} className="text-[#047EAF] w-full px-3 py-2 hover:bg-gray-100 rounded-md text-left">Restore Account</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-[#047EAF] font-bold text-sm">User Accounts</span>
                    <div className="flex-1 h-px bg-[#D8D8D8]" />
                </div>
                <div className="w-277">
                    <div className="overflow-x-auto">
                        <div className={`grid ${editMode ? "grid-cols-[auto_1.5fr_2.2fr_2.9fr_0.8fr_1fr_1.5fr_1fr_auto]" : "grid-cols-[1.5fr_2.2fr_2.9fr_0.8fr_1fr_1.5fr_1fr_auto]"} bg-[#D9EEF9] p-3 rounded-sm text-[#047EAF] font-semibold w-300 mr-4`}>
                            {editMode && (
                                <div className="px-2 flex items-center">
                                    <input type="checkbox" checked={allUsersSelected} onChange={toggleSelectAllUsers} className="w-4 h-4 accent-[#047EAF] cursor-pointer" />
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
                            <div key={u.id} className={`grid ${editMode ? "grid-cols-[auto_152px_212px_286px_80px_100px_140px_100px_auto]" : "grid-cols-[152px_222px_296px_80px_100px_150px_100px_auto]"} p-3 border-b border-gray-100 items-start mr-4 ${editMode && selectedIds.includes(u.id) ? "bg-[#EAF5FB]" : ""}`}>
                                {editMode && (
                                    <div className="px-2 flex items-center">
                                        <input type="checkbox" checked={selectedIds.includes(u.id)} onChange={() => toggleSelect(u.id)} className="w-4 h-4 accent-[#047EAF] cursor-pointer" />
                                    </div>
                                )}
                                <div className="px-2 truncate">{u.id}</div>
                                <div className="px-2 truncate">{u.name}</div>
                                <div className="px-2 truncate">{u.microsoftaccount}</div>
                                <div className="px-2 truncate">{u.section}</div>
                                <div className="px-2 truncate">{"********"}</div>
                                <div className="px-2 truncate">{u.date}</div>
                                <div className="px-2">
                                    <span className="bg-[#FFF6D4] text-[#FFCC00] px-3 py-1 rounded-lg text-xs inline-block truncate max-w-full">{u.role}</span>
                                </div>
                                <div className="px-2 flex justify-center relative w-20">
                                    <button onClick={() => setActiveMenu(activeMenu === `user-${u.id}` ? null : `user-${u.id}`)} className="text-lg font-bold">•••</button>
                                    {activeMenu === `user-${u.id}` && (
                                        <div data-popup="true" className="absolute right-0 -top-10 bg-white shadow-md border border-[#646464] rounded-md w-44 z-50">
                                            <button data-popup="true" onClick={() => { setSelectedUser(u); setActiveMenu(null); }} className="text-[#646464] w-full px-3 py-2 hover:bg-gray-100 rounded-md text-left">View User Detail</button>
                                            <button data-popup="true" onClick={() => handleRestore(u.id, 'user')} className="text-[#047EAF] w-full px-3 py-2 hover:bg-gray-100 rounded-md text-left">Restore Account</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
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