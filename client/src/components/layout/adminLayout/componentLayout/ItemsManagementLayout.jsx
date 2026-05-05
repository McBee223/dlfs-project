import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import FilterButton from "../../../ui/adminUI/buttons/FilterButton";
import EditButton from "../../../ui/adminUI/buttons/EditButton";
import DeleteButton from "../../../ui/adminUI/buttons/DeleteButton";
import AddItemPopup from "../../../ui/adminUI/popups/AddItemPopup";
import MoveToArchiveConfirmationPopup from "../../../ui/userUI/popups/MoveToArchiveConfirmationPopup";
import DeleteForeverConfirmationPopup from "../../../ui/userUI/popups/DeleteForeverConfirmationPopup";
import ViewItemPopup from "../../../ui/adminUI/popups/ViewItemPopup";
import ViewSubmissionDetailsPopup from "../../../ui/adminUI/popups/ViewSubmissionDetailsPopup";
import FilterPopup from "../../../ui/adminUI/popups/FilterPopup";
import RejectClaimRequestPopup from "../../../ui/adminUI/popups/RejectClaimRequestPopup";

import NoItemsFoundLayout from "./NoItemFoundLayout";
import NoItemsYetLayout from "./NoItemsYetLayout";

import ApproveRequestButton from "../../../../assets/images/ApproveRequestButton.png";
import RejectRequestButton from "../../../../assets/images/RejectRequestButton.png";

import SearchIcon from "../../../../assets/icons/SearchIcon.svg";
import AddItemIcon from "../../../../assets/icons/AddItemIcon.svg";

import UnclaimedIcon from "../../../../assets/icons/UnclaimedIcon.svg";
import PendingIcon from "../../../../assets/icons/PendingIcon.svg";
import ApprovedIcon from "../../../../assets/icons/ApprovedIcon.svg";
import RejectedIcon from "../../../../assets/icons/RejectedIcon.svg";
import ReturnedIcon from "../../../../assets/icons/ReturnedIcon.svg";
import CancelledIcon from "../../../../assets/icons/CancelledIcon.svg";

import ReturnItemIcon from "../../../../assets/icons/ReturnItemIcon.svg";
import ReturnItemIcon2 from "../../../../assets/icons/ReturnItemIcon2.svg";

function ItemsManagementLayout({ onClaimCountChange, initialSearch = "" }) {
    const location = useLocation();
    const navigate = useNavigate();
    const filterRef = useRef(null);

    const [editMode, setEditMode] = useState(false);
    const [addItemOpen, setAddItemOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [showPopup, setShowPopup] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [openFilter, setOpenFilter] = useState(false);
    const [lostItems, setLostItems] = useState([]);
    const [restoreTarget, setRestoreTarget] = useState(null);
    const [rejectTarget, setRejectTarget] = useState(null);
    const [searchTerm, setSearchTerm] = useState(initialSearch);

    useEffect(() => {
        if (initialSearch) {
            setSearchTerm(initialSearch);
            navigate("/admin/items_management/lost");
        }
    }, [initialSearch]);



    const getToken = () => localStorage.getItem('adminToken');

    const [filters, setFilters] = useState({
        status: "", type: "", fromDate: "", toDate: "", keyword: ""
    });

    const [dataMap, setDataMap] = useState({
        lost: [], claim: [], approved: [], rejected: [], returned: [], trash: [],
    });

    const fetchLostItems = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/lost-items`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.items) {
                    const mapped = data.items.map(item => ({
                        id: item.id,
                        name: item.name,
                        category: item.category,
                        dateFound: item.date_found,
                        date_found: item.date_found,
                        lastSeen: item.last_seen,
                        last_seen: item.last_seen,
                        image: item.image || '',
                        status: item.status,
                        additional_info: item.additional_info || '',
                        additionalInfo: item.additional_info || '',
                    }));
                    setLostItems(mapped);
                    setDataMap(prev => ({ ...prev, lost: mapped }));
                }
            })
            .catch(err => console.error('Failed to fetch lost items:', err));
    };

    const fetchClaimItems = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/claims`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.claims) {
                    const mapped = data.claims.map(c => ({
                        claimId: `#C${String(c.id).padStart(3, '0')}`,
                        claimDbId: c.id,
                        claimant: c.claimant?.replace(/\|/g, ' '),
                        itemNumber: `#${c.lost_item_id}`,
                        itemName: c.item_name,
                        category: c.category,
                        lastSeen: c.last_seen || '',
                        last_seen: c.last_seen || '',
                        image: c.item_image || '',
                        dateSubmitted: c.date_submitted,
                        dateFound: c.date_found || null,
                        date_found: c.date_found || null,
                        additional_info: c.additional_info || '',
                        additionalInfo: c.additional_info || '',
                        status: c.status,
                        item_condition: c.item_condition,
                        description: c.description,
                        color: c.color,
                        claimImage: c.image || '',
                        brand: c.brand,
                        pickup_date: c.pickup_date || null,
                        pickup_time: c.pickup_time || null,
                        userId: c.user_id,
                        lostItemId: c.lost_item_id,
                    }));
                    setDataMap(prev => ({ ...prev, claim: mapped }));
                    if (onClaimCountChange) onClaimCountChange(mapped.length);
                }
            })
            .catch(err => console.error('Failed to fetch claims:', err));
    };

    const fetchApprovedItems = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/claims/approved`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.claims) {
                    const mapped = data.claims.map(c => ({
                        claimId: `#C${String(c.id).padStart(3, '0')}`,
                        claimDbId: c.id,
                        claimant: c.claimant?.replace(/\|/g, ' '),
                        itemNumber: `#${c.lost_item_id}`,
                        itemName: c.item_name,
                        category: c.category,
                        dateApproved: c.date_approved_raw || c.date_submitted,
                        status: 'Approved',
                        userId: c.user_id,
                        lostItemId: c.lost_item_id,
                        lastSeen: c.last_seen || '',
                        last_seen: c.last_seen || '',
                        image: c.item_image || '',
                        additional_info: c.additional_info || '',
                        additionalInfo: c.additional_info || '',
                        dateFound: c.date_found || null,
                        date_found: c.date_found || null,
                    }));
                    setDataMap(prev => ({ ...prev, approved: mapped }));
                }
            })
            .catch(err => console.error('Failed to fetch approved:', err));
    };

    const fetchRejectedItems = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/claims/rejected`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.claims) {
                    const mapped = data.claims.map(c => ({
                        claimId: `#C${String(c.id).padStart(3, '0')}`,
                        claimDbId: c.id,
                        claimant: c.claimant?.replace(/\|/g, ' '),
                        itemNumber: `#${c.lost_item_id}`,
                        itemName: c.item_name,
                        category: c.category,
                        dateRejected: c.date_rejected_raw || c.date_submitted,
                        status: 'Rejected',
                        userId: c.user_id,
                        lostItemId: c.lost_item_id,
                        lastSeen: c.last_seen || '',
                        last_seen: c.last_seen || '',
                        image: c.item_image || '',
                        additional_info: c.additional_info || '',
                        additionalInfo: c.additional_info || '',
                        dateFound: c.date_found || null,
                        date_found: c.date_found || null,
                    }));
                    setDataMap(prev => ({ ...prev, rejected: mapped }));
                }
            })
            .catch(err => console.error('Failed to fetch rejected:', err));
    };

    const fetchReturnedItems = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/returned-items`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.items) {
                    const mapped = data.items.map(c => ({
                        claimId: `#C${String(c.claim_id).padStart(3, '0')}`,
                        claimDbId: c.claim_id,
                        claimant: c.claimant?.replace(/\|/g, ' '),
                        itemNumber: c.lost_item_id ? `#${c.lost_item_id}` : '-',
                        itemName: c.item_name,
                        category: c.category,
                        dateReturned: c.date_returned_raw || c.date_returned,
                        status: 'Returned',
                        userId: c.user_id,
                        lostItemId: c.lost_item_id,
                        lastSeen: c.last_seen || '',
                        last_seen: c.last_seen || '',
                        image: c.image || '',
                        additional_info: c.additional_info || '',
                        additionalInfo: c.additional_info || '',
                        dateFound: c.date_found || null,
                        date_found: c.date_found || null,
                    }));
                    setDataMap(prev => ({ ...prev, returned: mapped }));
                }
            })
            .catch(err => console.error('Failed to fetch returned items:', err));
    };

    const fetchTrashItems = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/trash`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.items) {
                    const mapped = data.items.map(t => ({
                        trashDbId: t.id,
                        claimId: t.claim_id,
                        claimant: t.claimant?.replace(/\|/g, ' '),
                        itemNumber: t.item_number,
                        itemName: t.item_name,
                        status: t.status,
                        dateDeleted: t.dateDeleted,
                        sourceTab: t.source_tab,
                        category: t.category || '',
                        date_found: t.date_found || null,
                        dateFound: t.date_found || null,
                        last_seen: t.last_seen || null,
                        lastSeen: t.last_seen || null,
                        image: t.image || null,
                        additional_info: t.additional_info || null,
                        additionalInfo: t.additional_info || null,
                    }));
                    setDataMap(prev => ({ ...prev, trash: mapped }));
                }
            })
            .catch(err => console.error('Failed to fetch trash:', err));
    };

    useEffect(() => {
        fetchLostItems();
        fetchClaimItems();
        fetchApprovedItems();
        fetchRejectedItems();
        fetchReturnedItems();
        fetchTrashItems();
        const interval = setInterval(() => {
            fetchClaimItems();
            fetchApprovedItems();
            fetchRejectedItems();
            fetchReturnedItems();
            fetchTrashItems();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const moveClaim = (item, targetStatus) => {
        const status = targetStatus === 'approved' ? 'Approved' : 'Rejected';
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/claims/${item.claimDbId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify({ status })
        })
            .then(res => res.json())
            .then(() => fetchClaimItems())
            .catch(err => console.error('Failed to update claim:', err));
    };

    const handleReturnItem = (item) => {
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/claims/${item.claimDbId}/return`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }
        })
            .then(res => res.json())
            .then(() => { fetchApprovedItems(); fetchReturnedItems(); })
            .catch(err => console.error('Failed to return item:', err));
    };

    const handleCancelSchedule = (item) => {
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/trash`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify({
                source_tab: 'cancelled',
                claim_id: item.claimId,
                claimant: item.claimant?.replace(/\|/g, ' '),
                item_number: item.itemNumber,
                item_name: item.itemName,
                status: 'Cancelled',
                original_id: item.claimDbId,
                user_id: item.userId,
                lost_item_id: item.lostItemId,
                category: item.category || null,
                date_found: item.dateFound || item.date_found || null,
                last_seen: item.lastSeen || item.last_seen || null,
                image: item.image || null,
                additional_info: item.additional_info || item.additionalInfo || null,
            })
        })
            .then(res => res.json())
            .then(() => {
                fetch(`${import.meta.env.VITE_API_URL}/api/admin/claims/${item.claimDbId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                    body: JSON.stringify({ status: 'Pending' })
                })
                    .then(() => {
                        fetch(`${import.meta.env.VITE_API_URL}/api/admin/claims/${item.claimDbId}/cancel-notif`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }
                        });
                        fetchApprovedItems();
                        fetchClaimItems();
                        fetchTrashItems();
                    });
            })
            .catch(err => console.error('Failed to cancel schedule:', err));
    };

    const tabs = [
        { key: "lost", label: "Lost Items", path: "/admin/items_management/lost" },
        { key: "claim", label: "Claim Requests", path: "/admin/items_management/claims" },
        { key: "approved", label: "Approved Items", path: "/admin/items_management/approved" },
        { key: "rejected", label: "Rejected Items", path: "/admin/items_management/rejected" },
        { key: "returned", label: "Returned Items", path: "/admin/items_management/returned" },
        { key: "trash", label: "Trash", path: "/admin/items_management/trash" },
    ];

    const activeTab = tabs.find(t => location.pathname === t.path) || tabs[0];
    const rawData = dataMap[activeTab.key] || [];

    useEffect(() => {
        if (!openFilter) return;
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setOpenFilter(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [openFilter]);

    const statusIcons = {
        Unclaimed: UnclaimedIcon,
        Pending: PendingIcon,
        Approved: ApprovedIcon,
        Rejected: RejectedIcon,
        Returned: ReturnedIcon,
        Cancelled: CancelledIcon,
    };

    const formatDisplayDate = (dateString) => {
        if (!dateString) return "-";
        const d = new Date(String(dateString).replace(" ", "T"));
        if (isNaN(d)) return "-";
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const yyyy = d.getFullYear();
        return `${mm}-${dd}-${yyyy}`;
    };

    const currentData = rawData.filter((item) => {
        const term = searchTerm.toLowerCase();
        const keyword = filters.keyword?.toLowerCase() || "";
        const matchSearch = activeTab.key === "lost"
            ? `#${String(item.id)}`.toLowerCase().includes(term) ||
            String(item.id).toLowerCase().includes(term) ||
            item.name?.toLowerCase().includes(term)
            : item.name?.toLowerCase().includes(term) ||
            item.claimant?.toLowerCase().includes(term) ||
            item.itemName?.toLowerCase().includes(term) ||
            item.itemNumber?.toLowerCase().includes(term) ||
            String(item.id)?.toLowerCase().includes(term);
        const matchKeyword = keyword
            ? item.name?.toLowerCase().includes(keyword) ||
            item.itemName?.toLowerCase().includes(keyword) ||
            item.claimant?.toLowerCase().includes(keyword) ||
            item.category?.toLowerCase().includes(keyword) ||
            item.lastSeen?.toLowerCase().includes(keyword) ||
            String(item.id)?.toLowerCase().includes(keyword)
            : true;
        const matchStatus = filters.status ? item.status === filters.status : true;
        const matchType = filters.type ? item.category === filters.type : true;
        const rawDate = item.dateFound || item.dateSubmitted || item.dateApproved ||
            item.dateRejected || item.dateReturned || item.dateDeleted;
        const itemDate = rawDate ? new Date(String(rawDate).replace(" ", "T")) : null;
        const from = filters.fromDate ? new Date(filters.fromDate) : null;
        const to = filters.toDate ? new Date(filters.toDate + "T23:59:59") : null;
        return (
            matchSearch && matchStatus && matchType && matchKeyword &&
            (from && itemDate ? itemDate >= from : true) &&
            (to && itemDate ? itemDate <= to : true)
        );
    });

    const hasNoRawItems = rawData.length === 0;
    const hasNoFilteredItems = currentData.length === 0;
    const isFiltering =
        searchTerm.trim() !== "" || filters.status || filters.type ||
        filters.fromDate || filters.toDate || filters.keyword;

    const clearSearch = () => {
        setSearchTerm("");
        setFilters({ status: "", type: "", fromDate: "", toDate: "", keyword: "" });
    };

    const getRowId = (item) => item.trashDbId || item.id || item.claimId;

    const allSelected =
        currentData.length > 0 &&
        currentData.every(item => selectedIds.includes(getRowId(item)));

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (allSelected) setSelectedIds([]);
        else setSelectedIds(currentData.map(item => getRowId(item)));
    };

    useEffect(() => {
        setSelectedIds([]);
        setEditMode(false);
    }, [activeTab.key]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".menu-container")) setActiveMenu(null);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDeleteClick = () => {
        if (activeTab.key === "trash") {
            setShowPopup("deleteForever");
        } else {
            setShowPopup("moveToArchive");
        }
    };

    const handleConfirm = () => {
        if (activeTab.key === "trash") {
            const trashIds = selectedIds;
            fetch(`${import.meta.env.VITE_API_URL}/api/admin/trash/delete-forever`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ ids: trashIds })
            })
                .then(() => {
                    setDataMap(prev => ({
                        ...prev,
                        trash: prev.trash.filter(item => !trashIds.includes(item.trashDbId))
                    }));
                })
                .catch(err => console.error('Failed to delete forever:', err));
        } else {
            const itemsToTrash = dataMap[activeTab.key]
                .filter(item => selectedIds.includes(getRowId(item)));

            const trashPromises = itemsToTrash.map(item =>
                fetch(`${import.meta.env.VITE_API_URL}/api/admin/trash`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
                    body: JSON.stringify({
                        source_tab: activeTab.key,
                        claim_id: item.claimId || `#${item.id}`,
                        claimant: item.claimant || '-',
                        item_number: item.itemNumber || `#${item.id}`,
                        item_name: item.itemName || item.name,
                        status: item.status,
                        original_id: item.claimDbId || item.id || null,
                        user_id: item.userId || null,
                        lost_item_id: item.lostItemId || null,
                        category: item.category || null,
                        date_found: item.dateFound || item.date_found || null,
                        last_seen: item.lastSeen || item.last_seen || null,
                        image: item.image || null,
                        additional_info: item.additional_info || item.additionalInfo || null,
                    })
                }).then(res => res.json())
            );

            Promise.all(trashPromises)
                .then(() => {
                    fetchTrashItems();
                    if (activeTab.key === 'lost') fetchLostItems();
                    if (activeTab.key === 'claim') fetchClaimItems();
                    if (activeTab.key === 'approved') fetchApprovedItems();
                    if (activeTab.key === 'rejected') fetchRejectedItems();
                    if (activeTab.key === 'returned') fetchReturnedItems();
                })
                .catch(err => console.error('Failed to move to trash:', err));
        }

        setShowPopup(null);
        setSelectedIds([]);
        setEditMode(false);
    };

    const handleRestoreItem = (item) => {
        const trashId = item.trashDbId;
        const sourceTab = item.sourceTab;

        if (!trashId) {
            console.error('Missing trashDbId on item:', item);
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/api/admin/trash/${trashId}/restore`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }
        })
            .then(res => res.json())
            .then((data) => {
                if (data.message?.toLowerCase().includes('failed')) {
                    console.error('Restore failed:', data.message);
                    return;
                }
                setDataMap(prev => ({
                    ...prev,
                    trash: prev.trash.filter(t => t.trashDbId !== trashId)
                }));
                if (sourceTab === 'lost') fetchLostItems();
                else if (sourceTab === 'claim') fetchClaimItems();
                else if (sourceTab === 'approved') fetchApprovedItems();
                else if (sourceTab === 'rejected') fetchRejectedItems();
                else if (sourceTab === 'returned') fetchReturnedItems();
            })
            .catch(err => console.error('Failed to restore item:', err));
    };

    const checkboxCell = (id) => (
        <div className="px-2 flex items-center">
            <input
                type="checkbox"
                checked={selectedIds.includes(id)}
                onChange={() => toggleSelect(id)}
                className="w-4 h-4 accent-[#047EAF] cursor-pointer"
            />
        </div>
    );

    const checkboxHeader = (
        <div className="px-2 flex items-center">
            <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-[#047EAF] cursor-pointer"
            />
        </div>
    );

    return (
        <div className="mx-4 montserrat bg-white rounded-xl h-170 2xl:h-250 flex flex-col">
            <span className="w-full h-0.5 bg-gray-200 mt-2"></span>

            <div className="flex items-center justify-between mb-4 pt-4">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl 2xl:text-2xl text-[#646464] font-semibold">{activeTab.label}</h1>
                    <span className="text-xs 2xl:text-sm text-[#047EAF] bg-[#E8F7FF] px-3 py-0.5 rounded-full">
                        {currentData.length} Items
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex items-center border border-[#969696] rounded-md px-3 py-1.5 gap-2 group">
                        <img src={SearchIcon} className="w-4 h-4 2xl:w-5 2xl:h-5" />
                        <input
                            type="text"
                            placeholder={activeTab.key === "lost" ? "Search item number" : "Search claimant name"}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="text-sm 2xl:text-base outline-none"
                        />
                        {activeTab.key === "lost" && (
                            <div className="absolute -bottom-8 left-0 bg-gray-800 text-white text-xs 2xl:text-sm px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-50">
                                There's no claimant in this tab
                            </div>
                        )}
                    </div>

                    <div className="relative" ref={filterRef}>
                        <FilterButton active={openFilter} onClick={() => setOpenFilter(prev => !prev)} />
                        {openFilter && (
                            <div className="absolute -top-17 right-23 mt-2 z-50">
                                <FilterPopup
                                    initialFilters={filters}
                                    onApply={(newFilters) => { setFilters(newFilters); setOpenFilter(false); }}
                                    onClearAll={() => setFilters({ status: "", type: "", fromDate: "", toDate: "", keyword: "" })}
                                    onClose={() => setOpenFilter(false)}
                                />
                            </div>
                        )}
                    </div>

                    {editMode ? (
                        selectedIds.length > 0 ? (
                            <DeleteButton onClick={handleDeleteClick} />
                        ) : (
                            <DeleteButton onClick={() => setEditMode(false)} />
                        )
                    ) : (
                        <EditButton onClick={() => setEditMode(true)} />
                    )}

                    <button
                        onClick={() => setAddItemOpen(true)}
                        className="flex items-center gap-2 bg-[#047EAF] text-white text-sm 2xl:text-base px-4 py-1.5 2xl:px-5 2xl:py-2.5 rounded-md"
                    >
                        <img src={AddItemIcon} className="w-3 h-3 2xl:w-4 2xl:h-4" />
                        Add Item
                    </button>
                </div>
            </div>

            <div className="border-b border-[#D8D8D8] mb-4">
                <div className="flex gap-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => navigate(tab.path)}
                            className={`pb-2 font-semibold 2xl:text-lg focus:outline-none focus:ring-0 ${location.pathname === tab.path ? "text-[#047EAF] border-b-2 border-[#047EAF]" : "text-gray-500"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {hasNoRawItems ? (
                    <NoItemsYetLayout tab={activeTab.key} />
                ) : hasNoFilteredItems ? (
                    isFiltering ? (
                        <NoItemsFoundLayout onClear={clearSearch} />
                    ) : (
                        <NoItemsYetLayout tab={activeTab.key} />
                    )
                ) : (
                    <>
                        {activeTab.key === "lost" && (
                            <>
                                <div className={`grid ${editMode ? "grid-cols-[auto_160px_260px_180px_210px_150px_100px] 2xl:grid-cols-[50px_230px_310px_230px_270px_290px_80px]" : "grid-cols-[180px_260px_180px_220px_180px_80px] 2xl:grid-cols-[230px_310px_230px_270px_290px_80px]"} bg-[#D9EEF9] p-3 text-[#047EAF] font-semibold text-sm 2xl:text-base`}>
                                    {editMode && checkboxHeader}
                                    <div>Item Number</div>
                                    <div>Item Name</div>
                                    <div>Category</div>
                                    <div>Date Found</div>
                                    <div>Status</div>
                                    <div>Action</div>
                                </div>
                                {[...currentData]
                                    .sort((a, b) => Number(String(a.id).replace(/^#/, '')) - Number(String(b.id).replace(/^#/, '')))
                                    .map((item) => (
                                        <div key={item.id} className={`grid ${editMode ? "grid-cols-[auto_160px_260px_180px_210px_150px_100px] 2xl:grid-cols-[50px_230px_310px_230px_270px_290px_80px]" : "grid-cols-[180px_260px_180px_220px_180px_80px] 2xl:grid-cols-[230px_310px_230px_270px_290px_80px]"} p-3 items-center text-sm 2xl:text-base  border-b border-gray-100 ${editMode && selectedIds.includes(item.id) ? "bg-[#EAF5FB]" : ""}`}>
                                            {editMode && checkboxCell(item.id)}
                                            <div>#{String(item.id).replace(/^#/, '')}</div>
                                            <div className="truncate w-50">{item.name}</div>
                                            <div>{item.category}</div>
                                            <div>{formatDisplayDate(item.dateFound)}</div>
                                            <div><img src={UnclaimedIcon} className="w-24 2xl:w-26" /></div>
                                            <div className="menu-container relative flex justify-center">
                                                <button
                                                    onClick={() => setActiveMenu(activeMenu === getRowId(item) ? null : getRowId(item))}
                                                    className={`text-lg 2xl:text-xl font-bold focus:outline-none focus:ring-0 ${editMode ? "-ml-13 2xl:-ml-7" : "-ml-8"}`}
                                                >•••</button>
                                                {activeMenu === getRowId(item) && (
                                                    <div onClick={() => { setSelectedItem(null); setTimeout(() => setSelectedItem({ ...item, canEdit: true }), 0); setActiveMenu(null); }} className="absolute -right-3 -top-10 bg-white shadow-md border rounded-md w-36 z-20">
                                                        <button className="w-full px-3 py-2 hover:bg-gray-100 rounded-md text-left text-sm  2xl:text-base">View Item</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </>
                        )}

                        {activeTab.key === "claim" && (
                            <>
                                <div className={`grid ${editMode ? "grid-cols-[auto_120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[50px_190px_270px_235px_235px_235px_275px_90px]" : "grid-cols-[120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[190px_270px_235px_235px_235px_275px_90px]"} bg-[#D9EEF9] p-3 text-[#047EAF] font-semibold text-sm 2xl:text-base `}>
                                    {editMode && checkboxHeader}
                                    <div>Claim ID</div>
                                    <div>Claimant Name</div>
                                    <div>Item Number</div>
                                    <div>Item Name</div>
                                    <div>Date Submitted</div>
                                    <div>Status</div>
                                    <div>Actions</div>
                                </div>
                                {currentData.map((item) => (
                                    <div key={item.claimId} className={`grid ${editMode ? "grid-cols-[auto_120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[50px_190px_270px_235px_235px_235px_275px_90px]" : "grid-cols-[120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[190px_270px_235px_235px_235px_275px_90px]"} p-3 items-center text-sm 2xl:text-base  border-b border-gray-100 ${editMode && selectedIds.includes(item.claimId) ? "bg-[#EAF5FB]" : ""}`}>
                                        {editMode && checkboxCell(item.claimId)}
                                        <div>{item.claimId}</div>
                                        <div className="text-[#047EAF] truncate w-40">{item.claimant}</div>
                                        <div>{item.itemNumber}</div>
                                        <div className="truncate w-35">{item.itemName}</div>
                                        <div>{formatDisplayDate(item.dateSubmitted)}</div>
                                        <div><img src={PendingIcon} className="w-24 2xl:w-27 h-auto" /></div>
                                        <div className="menu-container flex items-center gap-2 relative">
                                            <button onClick={() => setSelectedSubmission(item)} className="transition-transform duration-150 hover:scale-110">
                                                <img src={ApproveRequestButton} className="w-5 h-5 2xl:w-6 2xl:h-6 " />
                                            </button>
                                            <button onClick={() => setRejectTarget(item)} className="transition-transform duration-150 hover:scale-110">
                                                <img src={RejectRequestButton} className="w-5 h-5 2xl:w-6 2xl:h-6" />
                                            </button>
                                            <button onClick={() => setActiveMenu(activeMenu === item.claimId ? null : item.claimId)} className={`text-lg 2xl:text-xl font-bold focus:outline-none focus:ring-0`}>•••</button>
                                            {activeMenu === item.claimId && (
                                                <div className="absolute right-9 2xl:-right-22 -top-6 2xl:-top-14 bg-white shadow-md border rounded-md w-40 2xl:w-50 z-20">
                                                    <button onClick={() => { setSelectedItem(null); setTimeout(() => setSelectedItem({ ...item, canEdit: false }), 0); setActiveMenu(null); }} className="w-full px-3 py-2 hover:bg-gray-100 rounded-md text-left text-sm 2xl:text-base">View Item</button>
                                                    <button onClick={() => { setSelectedSubmission(item); setActiveMenu(null); }} className="w-full px-3 py-2 hover:bg-gray-100 rounded-md text-left text-sm 2xl:text-base">View Submission</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {activeTab.key === "approved" && (
                            <>
                                <div className={`grid ${editMode ? "grid-cols-[auto_120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[50px_190px_270px_235px_235px_235px_275px_90px]" : "grid-cols-[120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[190px_270px_235px_235px_235px_275px_90px]"} bg-[#D9EEF9] p-3 text-[#047EAF] font-semibold text-sm 2xl:text-base `}>
                                    {editMode && checkboxHeader}
                                    <div>Claim ID</div>
                                    <div>Claimant Name</div>
                                    <div>Item Number</div>
                                    <div>Item Name</div>
                                    <div>Date Approved</div>
                                    <div>Status</div>
                                    <div>Actions</div>
                                </div>
                                {currentData.map((item) => (
                                    <div key={item.claimId} className={`grid ${editMode ? "grid-cols-[auto_120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[50px_190px_270px_235px_235px_235px_275px_90px]" : "grid-cols-[120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[190px_270px_235px_235px_235px_275px_90px]"} p-3 items-center text-sm 2xl:text-base  border-b border-gray-100 ${editMode && selectedIds.includes(item.claimId) ? "bg-[#EAF5FB]" : ""}`}>
                                        {editMode && checkboxCell(item.claimId)}
                                        <div>{item.claimId}</div>
                                        <div className="text-[#047EAF] truncate w-40">{item.claimant}</div>
                                        <div>{item.itemNumber}</div>
                                        <div className="truncate w-40">{item.itemName}</div>
                                        <div>{formatDisplayDate(item.dateApproved)}</div>
                                        <div><img src={ApprovedIcon} className="w-24 2xl:w-26" /></div>
                                        <div className="menu-container relative flex items-center gap-2">
                                            <div className="relative group">
                                                <button onClick={() => handleReturnItem(item)}>
                                                    <img src={ReturnItemIcon2} className="w-5 h-5 2xl:w-6 2xl:h-6 group-hover:hidden" />
                                                    <img src={ReturnItemIcon} className="w-5 h-5 2xl:w-6 2xl:h-6 hidden group-hover:block" />
                                                </button>
                                                <div className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-[#047EAF] text-white text-xs 2xl:text-sm px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                                    Mark as Returned
                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#047EAF]"></div>
                                                </div>
                                            </div>
                                            <button onClick={() => setActiveMenu(activeMenu === item.claimId ? null : item.claimId)} className={`text-lg 2xl:text-xl font-bold focus:outline-none focus:ring-0 mb-2`}>•••</button>
                                            {activeMenu === item.claimId && (
                                                <div className="absolute right-18 2xl:-right-13 -top-6 2xl:-top-14 bg-white shadow-md border rounded-md w-40 2xl:w-50 z-20">
                                                    <button
                                                        onClick={() => { setSelectedItem(null); setTimeout(() => setSelectedItem({ ...item, canEdit: false }), 0); setActiveMenu(null); }}
                                                        className="w-full px-3 py-2 hover:bg-gray-100 rounded-md text-left text-sm 2xl:text-base">
                                                        View Item
                                                    </button>
                                                    <button
                                                        onClick={() => { handleCancelSchedule(item); setActiveMenu(null); }}
                                                        className="w-full px-3 py-2 hover:bg-gray-100 rounded-md text-left text-sm 2xl:text-base text-red-500">
                                                        Cancel Schedule
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {activeTab.key === "rejected" && (
                            <>
                                <div className={`grid ${editMode ? "grid-cols-[auto_120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[50px_190px_270px_235px_235px_235px_275px_90px]" : "grid-cols-[120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[190px_270px_235px_235px_235px_275px_90px]"} bg-[#D9EEF9] p-3 text-[#047EAF] font-semibold text-sm 2xl:text-base `}>
                                    {editMode && checkboxHeader}
                                    <div>Claim ID</div>
                                    <div>Claimant Name</div>
                                    <div>Item Number</div>
                                    <div>Item Name</div>
                                    <div>Date Rejected</div>
                                    <div>Status</div>
                                    <div>Actions</div>
                                </div>
                                {currentData.map((item) => (
                                    <div key={item.claimId} className={`grid ${editMode ? "grid-cols-[auto_120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[50px_190px_270px_235px_235px_235px_275px_90px]" : "grid-cols-[120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[190px_270px_235px_235px_235px_275px_90px]"} p-3 items-center text-sm 2xl:text-base  border-b border-gray-100 ${editMode && selectedIds.includes(item.claimId) ? "bg-[#EAF5FB]" : ""}`}>
                                        {editMode && checkboxCell(item.claimId)}
                                        <div>{item.claimId}</div>
                                        <div className="text-[#047EAF] truncate w-40">{item.claimant}</div>
                                        <div>{item.itemNumber}</div>
                                        <div className="truncate w-40">{item.itemName}</div>
                                        <div>{formatDisplayDate(item.dateRejected)}</div>
                                        <div><img src={RejectedIcon} className="w-24 2xl:w-26" /></div>
                                        <div className="menu-container relative flex justify-center">
                                            <button onClick={() => setActiveMenu(activeMenu === getRowId(item) ? null : getRowId(item))} className={`text-lg 2xl:text-xl font-bold focus:outline-none focus:ring-0 ${editMode ? "-ml-8 2xl:-ml-7" : "-ml-8"}`}>•••</button>
                                            {activeMenu === getRowId(item) && (
                                                <div className="absolute -right-3 2xl:-right-4 -top-10 bg-white shadow-md border rounded-md w-36 z-20">
                                                    <button onClick={() => { setSelectedItem(null); setTimeout(() => setSelectedItem({ ...item, canEdit: false }), 0); setActiveMenu(null); }} className="w-full px-3 py-2 hover:bg-gray-100 rounded-md text-left text-sm 2xl:text-base">View Item</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {activeTab.key === "returned" && (
                            <>
                                <div className={`grid ${editMode ? "grid-cols-[auto_120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[50px_190px_270px_235px_235px_235px_275px_90px]" : "grid-cols-[120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[190px_270px_235px_235px_235px_275px_90px]"} bg-[#D9EEF9] p-3 text-[#047EAF] font-semibold text-sm 2xl:text-base `}>
                                    {editMode && checkboxHeader}
                                    <div>Claim ID</div>
                                    <div>Claimant Name</div>
                                    <div>Item Number</div>
                                    <div>Item Name</div>
                                    <div>Date Returned</div>
                                    <div>Status</div>
                                    <div>Actions</div>
                                </div>
                                {currentData.map((item) => (
                                    <div key={item.claimId} className={`grid ${editMode ? "grid-cols-[auto_120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[50px_190px_270px_235px_235px_235px_275px_90px]" : "grid-cols-[120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[190px_270px_235px_235px_235px_275px_90px]"} p-3 items-center text-sm 2xl:text-base  border-b border-gray-100 ${editMode && selectedIds.includes(item.claimId) ? "bg-[#EAF5FB]" : ""}`}>
                                        {editMode && checkboxCell(item.claimId)}
                                        <div>{item.claimId}</div>
                                        <div className="text-[#047EAF] truncate w-40">{item.claimant}</div>
                                        <div>{item.itemNumber}</div>
                                        <div className="truncate w-40">{item.itemName}</div>
                                        <div>{formatDisplayDate(item.dateReturned)}</div>
                                        <div><img src={ReturnedIcon} className="w-24 2xl:w-26" /></div>
                                        <div className="menu-container relative flex justify-center">
                                            <button onClick={() => setActiveMenu(activeMenu === getRowId(item) ? null : getRowId(item))} className={`text-lg 2xl:text-xl font-bold focus:outline-none focus:ring-0 ${editMode ? "-ml-8 2xl:-ml-7" : "-ml-8"}`}>•••</button>
                                            {activeMenu === getRowId(item) && (
                                                <div className="absolute -right-3 2xl:-right-4 -top-10 bg-white shadow-md border rounded-md w-36 z-20">
                                                    <button onClick={() => { setSelectedItem(null); setTimeout(() => setSelectedItem({ ...item, canEdit: false }), 0); setActiveMenu(null); }} className="w-full px-3 py-2 hover:bg-gray-100 rounded-md text-left text-sm 2xl:text-base">View Item</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {activeTab.key === "trash" && (
                            <>
                                <div className={`grid ${editMode ? "grid-cols-[auto_120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[50px_190px_270px_235px_235px_235px_275px_90px]" : "grid-cols-[120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[190px_270px_235px_235px_235px_275px_90px]"} bg-[#D9EEF9] p-3 text-[#047EAF] font-semibold text-sm 2xl:text-base`}>
                                    {editMode && checkboxHeader}
                                    <div>Claim ID</div>
                                    <div>Claimant Name</div>
                                    <div>Item Number</div>
                                    <div>Item Name</div>
                                    <div>Date Deleted</div>
                                    <div>Status</div>
                                    <div>Actions</div>
                                </div>
                                {currentData.map((item) => (
                                    <div key={item.trashDbId} className={`grid ${editMode ? "grid-cols-[auto_120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[50px_190px_270px_235px_235px_235px_275px_90px]" : "grid-cols-[120px_200px_165px_165px_165px_165px_90px] 2xl:grid-cols-[190px_270px_235px_235px_235px_275px_90px]"} p-3 items-center text-sm 2xl:text-base border-b border-gray-100 ${editMode && selectedIds.includes(item.trashDbId) ? "bg-[#EAF5FB]" : ""}`}>
                                        {editMode && checkboxCell(item.trashDbId)}
                                        <div>{item.claimId || "-"}</div>
                                        <div className="text-[#047EAF] truncate w-40 2xl:w-50">{item.claimant || "-"}</div>
                                        <div>{item.itemNumber || "-"}</div>
                                        <div className="truncate w-40 2xl:w-50">{item.itemName || "-"}</div>
                                        <div>{formatDisplayDate(item.dateDeleted)}</div>
                                        <div><img src={statusIcons[item.status]} className="w-24 2xl:w-26" /></div>
                                        <div className="menu-container relative flex justify-center">
                                            <button onClick={() => setActiveMenu(activeMenu === item.trashDbId ? null : item.trashDbId)} className={`text-lg 2xl:text-xl font-bold focus:outline-none focus:ring-0 ${editMode ? "-ml-8 2xl:-ml-7" : "-ml-8"}`}>•••</button>
                                            {activeMenu === item.trashDbId && (
                                                <div className="absolute -right-3 2xl:-right-7 -top-10 2xl:-top-15 bg-white shadow-md border rounded-md w-36 2xl:w-44 z-20">
                                                    <button
                                                        onClick={() => { setSelectedItem({ ...item, canEdit: false }); setActiveMenu(null); }}
                                                        className="w-full px-3 py-2 hover:bg-gray-100 rounded-md text-left text-sm 2xl:text-base">
                                                        View Item
                                                    </button>
                                                    {item.status !== 'Cancelled' && (
                                                        <button
                                                            onClick={() => { handleRestoreItem(item); setActiveMenu(null); }}
                                                            className="w-full px-3 py-2 hover:bg-gray-100 rounded-md text-left text-sm 2xl:text-base text-[#047EAF]">
                                                            Restore
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </>
                )}
            </div>

            {addItemOpen && (
                <AddItemPopup
                    onClose={() => setAddItemOpen(false)}
                    onSuccess={() => {
                        setAddItemOpen(false);
                        fetchLostItems();
                        navigate("/admin/items_management/lost");
                    }}
                />
            )}

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

            {selectedItem && (
                <ViewItemPopup
                    key={selectedItem.trashDbId || selectedItem.id || selectedItem.claimId}
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onRestore={
                        activeTab.key === 'trash'
                            ? () => {
                                handleRestoreItem(selectedItem);
                                setSelectedItem(null);
                            }
                            : undefined
                    }
                    onSave={(updated) => {
                        const updatedItems = lostItems.map(i =>
                            String(i.id) === String(updated.originalId)
                                ? {
                                    ...i,
                                    name: updated.name,
                                    category: updated.category,
                                    dateFound: updated.dateFound,
                                    date_found: updated.dateFound,
                                    lastSeen: updated.lastSeen,
                                    last_seen: updated.lastSeen,
                                    image: updated.image,
                                    additional_info: updated.additional_info,
                                    additionalInfo: updated.additional_info,
                                }
                                : i
                        );
                        setLostItems(updatedItems);
                        setDataMap(prev => ({ ...prev, lost: updatedItems }));
                        setSelectedItem(null);
                    }}
                />
            )}

            {selectedSubmission && (
                <ViewSubmissionDetailsPopup
                    item={selectedSubmission}
                    onClose={() => setSelectedSubmission(null)}
                    onApprove={(item) => { moveClaim(item, "approved"); setSelectedSubmission(null); }}
                    onReject={(item) => { moveClaim(item, "rejected"); setSelectedSubmission(null); }}
                />
            )}

            {rejectTarget && (
                <RejectClaimRequestPopup
                    onClose={() => setRejectTarget(null)}
                    onConfirm={() => {
                        moveClaim(rejectTarget, "rejected");
                        setRejectTarget(null);
                    }}
                />
            )}
        </div>
    );
}

export default ItemsManagementLayout;



