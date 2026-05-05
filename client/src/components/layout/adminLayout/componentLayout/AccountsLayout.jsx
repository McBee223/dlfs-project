import { useState, useRef, useEffect } from "react";

import EditButton from "../../../ui/adminUI/buttons/EditButton";
import DeleteButton from "../../../ui/adminUI/buttons/DeleteButton";
import AddAdminButton from "../../../ui/adminUI/buttons/AddAdminButton";

import SortByPopup from "../../../ui/adminUI/popups/SortByPopup";
import MoveToArchiveConfirmationPopup from "../../../ui/adminUI/popups/MoveToArchiveConfirmationPopup";
import DeleteForeverConfirmationPopup from "../../../ui/adminUI/popups/DeleteForeverConfirmationPopup";
import AddAdminPopup from "../../../ui/adminUI/popups/AddAdminPopup";

import UserAccountLayout from "./UserAccountLayout";
import AdminAccountLayout from "./AdminAccountLayout";
import ArchiveLayout from "./ArchiveLayout";

import SearchIcon from "../../../../assets/icons/SearchIcon.svg";
import DropdownIcon from "../../../../assets/icons/DropdownIcon.svg";

import { jwtDecode } from "jwt-decode";

function AccountsLayout({ onUserCountChange }) {
    const token = localStorage.getItem('adminToken');
    const currentAdminId = token ? jwtDecode(token).id : null;
    const [activeTab, setActiveTab] = useState("user");
    const [showSort, setShowSort] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [sortLabel, setSortLabel] = useState("All Time");
    const [selectedIds, setSelectedIds] = useState([]);
    const [showPopup, setShowPopup] = useState(null);
    const [showAddAdmin, setShowAddAdmin] = useState(false);
    const [search, setSearch] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const [resultCount, setResultCount] = useState(null);

    const [archiveTypeMap, setArchiveTypeMap] = useState({});

    const sortRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (sortRef.current && !sortRef.current.contains(e.target)) {
                setShowSort(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setSelectedIds([]);
        setEditMode(false);
        setResultCount(null);
    }, [activeTab]);

    const getTitle = () => {
        if (activeTab === "user") return "User Accounts";
        if (activeTab === "admin") return "Admin Accounts";
        return "Archive";
    };

    const handleEditToggle = () => {
        if (editMode && selectedIds.length > 0) {
            handleDeleteClick();
        } else {
            setEditMode(!editMode);
            setSelectedIds([]);
        }
    };

    const handleDeleteClick = () => {
        if (selectedIds.length === 0) return;
        if (activeTab === "archive") {
            setShowPopup("deleteForever");
        } else {
            setShowPopup("moveToArchive");
        }
    };

    const handleClearAll = () => {
        setSearch("");
        setSortLabel("All Time");
        setSelectedIds([]);
        setEditMode(false);
    };

    const handleConfirm = async () => {
        const token = localStorage.getItem('adminToken');

        if (activeTab === "admin" && selectedIds.includes(currentAdminId)) {
            alert("You cannot delete your own account.");
            setShowPopup(null);
            return;
        }

        if (activeTab === "archive") {
            await Promise.all(
                selectedIds.map((key) => {
                    const type = archiveTypeMap[key] || 'user';
                    const id = key.replace(/^(admin-|user-)/, ''); // strip prefix
                    return fetch(`${import.meta.env.VITE_API_URL}/api/admin/archive/${id}?type=${type}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` }
                    });
                })
            );
        } else {
            const type = activeTab === "admin" ? "admin" : "user";
            await fetch(`${import.meta.env.VITE_API_URL}/api/admin/archive`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ ids: selectedIds, type })
            });
        }

        setSelectedIds([]);
        setShowPopup(null);
        setEditMode(false);
        setRefreshKey((k) => k + 1);
    };

    const renderLayout = () => {
        if (activeTab === "user") return (
            <UserAccountLayout
                key={refreshKey}
                editMode={editMode}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                search={search}
                sortLabel={sortLabel}
                onClear={handleClearAll}
                onCountChange={(count) => {
                    setResultCount(count);
                    if (onUserCountChange) onUserCountChange(count);
                }}
            />
        );

        if (activeTab === "admin") return (
            <AdminAccountLayout
                key={refreshKey}
                editMode={editMode}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                search={search}
                sortLabel={sortLabel}
                onClear={handleClearAll}
                onCountChange={setResultCount}
                currentAdminId={currentAdminId}
            />
        );

        return (
            <ArchiveLayout
                key={refreshKey}
                editMode={editMode}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                onTypeMapChange={setArchiveTypeMap}
                search={search}
                sortLabel={sortLabel}
                onClear={handleClearAll}
                onCountChange={setResultCount}
                onUserCountChange={onUserCountChange}
            />
        );
    };

    return (
        <div id="accounts-section" className="p-6 montserrat bg-white rounded-xl mx-2 h-150 2xl:h-180 flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div className="flex gap-3">
                    <h1 className="montserrat text-xl 2xl:text-2xl font-semibold">{getTitle()}</h1>
                    {resultCount !== null && (search || sortLabel !== "All Time") && (
                        <span className="text-sm 2xl:text-base text-[#969696] font-medium">
                            {resultCount} {resultCount === 1 ? "account" : "accounts"} found
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center border border-[#969696] rounded-md px-3 py-1.5 gap-2">
                        <img src={SearchIcon} alt="" className="w-4 h-4 2xl:w-5 2xl:h-5" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={
                                activeTab === "user"
                                    ? "Search user name..."
                                    : activeTab === "admin"
                                        ? "Search admin name..."
                                        : "Search archived name..."
                            }
                            className="text-sm 2xl:text-base outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-sm 2xl:text-base">
                        <span>Sort by</span>
                        <div className="relative" ref={sortRef}>
                            <button
                                onClick={() => setShowSort(!showSort)}
                                className="flex items-center gap-2 border border-[#969696] rounded-md px-3 py-1.5"
                            >
                                <span>{sortLabel}</span>
                                <img
                                    src={DropdownIcon}
                                    alt=""
                                    className={`w-4 h-4 2xl:w-5 2xl:h-5 transition-transform ${showSort ? "rotate-180" : ""}`}
                                />
                            </button>
                            {showSort && (
                                <SortByPopup
                                    setSortLabel={setSortLabel}
                                    setShowSort={setShowSort}
                                />
                            )}
                        </div>
                    </div>

                    <>
                        {editMode ? (
                            selectedIds.length > 0 ? (
                                <DeleteButton onClick={handleDeleteClick} />
                            ) : (
                                <DeleteButton onClick={handleEditToggle} />
                            )
                        ) : (
                            <EditButton onClick={handleEditToggle} />
                        )}
                    </>

                    <AddAdminButton onClick={() => setShowAddAdmin(true)} />
                </div>
            </div>

            <div className="border-b border-[#D8D8D8] mb-4">
                <div className="flex gap-6">
                    <button onClick={() => setActiveTab("user")} className={`pb-2 text-sm 2xl:text-base font-semibold focus:outline-none focus:ring-0 ${activeTab === "user" ? "text-[#047EAF] border-b-2 border-[#047EAF]" : "text-gray-500"}`}>
                        User Account
                    </button>
                    <button onClick={() => setActiveTab("admin")} className={`pb-2 text-sm 2xl:text-base font-semibold focus:outline-none focus:ring-0 ${activeTab === "admin" ? "text-[#047EAF] border-b-2 border-[#047EAF]" : "text-gray-500"}`}>
                        Admin Account
                    </button>
                    <button onClick={() => setActiveTab("archive")} className={`pb-2 text-sm 2xl:text-base font-semibold focus:outline-none focus:ring-0 ${activeTab === "archive" ? "text-[#047EAF] border-b-2 border-[#047EAF]" : "text-gray-500"}`}>
                        Archive
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                {renderLayout()}
            </div>

            {showPopup === "moveToArchive" && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <MoveToArchiveConfirmationPopup
                        onClose={() => setShowPopup(null)}
                        onConfirm={handleConfirm}
                    />
                </div>
            )}

            {showPopup === "deleteForever" && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <DeleteForeverConfirmationPopup
                        onClose={() => setShowPopup(null)}
                        onConfirm={handleConfirm}
                    />
                </div>
            )}

            {showAddAdmin && (
                <AddAdminPopup
                    onClose={() => setShowAddAdmin(false)}
                    onConfirm={(newAdmin) => {
                        setShowAddAdmin(false);
                        setActiveTab("admin");
                        setRefreshKey((k) => k + 1);
                    }}
                />
            )}
        </div>
    );
}

export default AccountsLayout;



