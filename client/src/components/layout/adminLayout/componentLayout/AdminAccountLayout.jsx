import { useState, useEffect } from "react";
import ViewAdminDetailsPopup from "../../../ui/adminUI/popups/ViewAdminDetailsPopup";
import NoAccountFoundLayout from "./NoAccountFoundLayout";
import NoAccountYetLayout from "./NoAccountYetLayout";

function AdminAccountLayout({
    editMode,
    selectedIds = [],
    setSelectedIds,
    search,
    sortLabel,
    onClear,
    onCountChange,
    currentAdminId
}) {
    const [activeMenu, setActiveMenu] = useState(null);
    const [showPassword, setShowPassword] = useState(null);
    const [selectedAdmin, setSelectedAdmin] = useState(null);

    const token = localStorage.getItem('adminToken');
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/admin/admins', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.admins) setAdmins(data.admins);
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

    const filteredData = admins.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes((search || "").toLowerCase());
        const matchesDate = isWithinRange(item.date);
        return matchesSearch && matchesDate;
    });

    useEffect(() => {
        if (onCountChange) onCountChange(filteredData.length);
    }, [filteredData.length]);

    const toggleSelect = (id) => {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };

    const allSelected = admins.length > 0 && admins.every((a) => selectedIds.includes(a.id));

    const toggleSelectAll = () => {
        if (allSelected) setSelectedIds([]);
        else setSelectedIds(admins.map((a) => a.id));
    };

    return (
        <div className="montserrat text-sm text-[#646464] font-semibold overflow-x-auto">
            <div className={`grid ${editMode ? "grid-cols-[auto_1fr_1.8fr_2.2fr_1fr_1.2fr_1fr_auto]" : "grid-cols-[1fr_1.8fr_2.2fr_1fr_1.2fr_1fr_auto]"} bg-[#D9EEF9] p-3 rounded-sm text-[#047EAF] font-semibold min-w-max`}>
                {editMode && (
                    <div className="px-2 flex items-center">
                        <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="w-4 h-4 accent-[#047EAF] cursor-pointer" />
                    </div>
                )}
                <div className="px-2">Admin ID</div>
                <div className="px-2">Name</div>
                <div className="px-2">Microsoft Account</div>
                <div className="px-2">Password</div>
                <div className="px-2">Date Registered</div>
                <div className="px-2">User Level</div>
                <div className="px-2 text-center w-20">Actions</div>
            </div>

            {admins.length === 0 ? (
                <NoAccountYetLayout info="admins" />
            ) : filteredData.length === 0 ? (
                <NoAccountFoundLayout onClear={onClear} />
            ) : filteredData.map((a) => (
                <div
                    key={a.id}
                    className={`grid ${editMode ? "grid-cols-[auto_1fr_1.8fr_2.2fr_1fr_1.2fr_1fr_auto]" : "grid-cols-[1fr_1.8fr_2.2fr_1fr_1.2fr_1fr_auto]"} p-3 border-b border-gray-100 items-center min-w-max ${editMode && selectedIds.includes(a.id) ? "bg-[#EAF5FB]" : ""} ${a.id === currentAdminId ? "opacity-50" : ""}`}
                >
                    {editMode && (
                        <div className="px-2 flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(a.id)}
                                onChange={() => toggleSelect(a.id)}
                                disabled={a.id === currentAdminId}
                                className="w-4 h-4 accent-[#047EAF] cursor-pointer disabled:cursor-not-allowed"
                            />
                        </div>
                    )}
                    <div className="px-2 truncate">{a.id}</div>
                    <div className="px-2 truncate">{a.name?.replace(/\|/g, ' ')}</div>
                    <div className="px-2 w-60 truncate">{a.microsoftaccount}</div>
                    <div className="px-2 truncate">{showPassword === a.id ? a.password : "********"}</div>
                    <div className="px-2 truncate">{a.date}</div>
                    <div className="px-2">
                        <span className="bg-[#FFF6D4] text-[#FFCC00] px-3 py-1 rounded-lg text-xs inline-block truncate max-w-full">{a.role}</span>
                    </div>
                    <div className="px-2 flex justify-center relative w-20">
                        <button onClick={() => setActiveMenu(activeMenu === a.id ? null : a.id)} className="text-lg font-bold">•••</button>
                        {activeMenu === a.id && (
                            <div data-popup="true" className="absolute right-0 -top-9 bg-white shadow-md border border-[#646464] rounded-md w-50 z-50">
                                <button data-popup="true" onClick={() => { setSelectedAdmin(a); setActiveMenu(null); }} className="text-[#646464] w-full px-3 py-2 hover:bg-gray-100 hover:rounded-md text-left">
                                    View Admin Detail
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {selectedAdmin && (
                <ViewAdminDetailsPopup
                    admin={selectedAdmin}
                    onClose={() => setSelectedAdmin(null)}
                    onUpdate={(updatedAdmin) => {
                        setAdmins(prev => prev.map(a => a.id === selectedAdmin.id ? { ...a, ...updatedAdmin } : a));
                        setSelectedAdmin(null);
                    }}
                />
            )}
        </div>
    );
}

export default AdminAccountLayout;