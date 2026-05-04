import { useState, useRef, useEffect } from "react";
import { authFetch } from "../../../../utils/authFetch";
import EditButton from "../../../ui/userUI/buttons/EditButton";
import DeleteButton from "../../../ui/userUI/buttons/DeleteButton";
import FilterButton from "../../../ui/userUI/buttons/FilterButton";
import FilterPopup from "../../../ui/userUI/popups/FilterPopup";
import MoveToArchiveConfirmationPopup from "../../../ui/userUI/popups/MoveToArchiveConfirmationPopup";
import DeleteForeverConfirmationPopup from "../../../ui/userUI/popups/DeleteForeverConfirmationPopup";
import NoItemFoundLayout from "./NoItemFoundLayout";
import NoItemsYetLayout from "./NoItemsYetLayout";
import ItemStatusLayout from "./ItemStatusLayout";

function ListOfItemLayout() {
    const [activeTab, setActiveTab] = useState("items");
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [items, setItems] = useState([]);
    const [trashItems, setTrashItems] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const filterRef = useRef(null);
    const getToken = () => localStorage.getItem("userToken");

    const [filters, setFilters] = useState({
        status: "", type: "", fromDate: "", toDate: "", keyword: ""
    });

    const fetchItemStatus = () => {
        return authFetch("http://localhost:3000/api/user/item-status", {
            headers: { Authorization: `Bearer ${getToken()}` }
        })
            .then(res => res.json())
            .then(data => {
                console.log('item status data:', data.items);
                if (data.items) {
                    const mapped = data.items
                        .filter(i => i != null && i.item_name != null && i.status != null)
                        .map(i => ({
                            id: i.id,
                            claim_id: i.claim_id ? parseInt(i.claim_id) || null : null,       // ✅
                            lost_item_id: i.lost_item_id ? parseInt(i.lost_item_id) || null : null,  // ✅
                            item: i.item_name,
                            type: i.category,
                            message: i.status === 'Returned'
                                ? 'Your item has been claimed and returned successfully.'
                                : i.status === 'Pending'
                                    ? 'Your claim request is pending review.'
                                    : i.message,
                            date_raw: i.date_submitted,
                            date: i.date_submitted ? new Date(i.date_submitted).toLocaleDateString("en-US", {
                                month: "2-digit", day: "2-digit", year: "numeric"
                            }) : null,
                            status: i.status,
                            image: i.image,
                            name: i.item_name,
                            category: i.category,
                            date_found: i.date_submitted,
                            last_seen: i.last_seen
                        }));
                    setItems(mapped);
                }
            })
            .catch(err => console.error("Failed to fetch item status:", err));
    };

    const fetchTrashItems = () => {
        return authFetch("http://localhost:3000/api/user/trash", {
            headers: { Authorization: `Bearer ${getToken()}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.items) {
                    const mapped = data.items.map(i => ({
                        id: i.id,
                        item: i.item_name,
                        type: i.category,
                        message: i.message,
                        date: i.date_submitted ? new Date(i.date_submitted).toLocaleDateString("en-US", {
                            month: "2-digit", day: "2-digit", year: "numeric"
                        }) : null,
                        status: i.status,
                        trashedAt: i.trashed_at,
                    }));
                    setTrashItems(mapped);
                }
            })
            .catch(err => console.error("Failed to fetch trash:", err));
    };

    useEffect(() => {
        fetchItemStatus();
        fetchTrashItems();
        const interval = setInterval(() => {
            fetchItemStatus();
            fetchTrashItems();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setSelectedItems([]);
        setEditMode(false);
    }, [activeTab]);

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

    const toggleSelect = (id) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const currentItems = activeTab === "items" ? items : trashItems;

    const toggleSelectAll = () => {
        if (selectedItems.length === currentItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(currentItems.map(i => i.id));
        }
    };

    const handleFilterApply = (newFilters) => {
        setFilters(newFilters);
        setOpenFilter(false);
    };

    const handleClearFilters = () => {
        setFilters({ status: "", type: "", fromDate: "", toDate: "", keyword: "" });
    };

    const handleClearSearch = () => {
        handleClearFilters();
        setOpenFilter(true);
    };

    const confirmMoveToTrash = async () => {
        const toTrash = items.filter(item => selectedItems.includes(item.id));

        try {
            await Promise.all(toTrash.map(item =>
                authFetch("http://localhost:3000/api/user/trash", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({
                        item_status_id: item.id,
                        lost_item_id: item.lost_item_id ?? null,
                        claim_id: item.claim_id ?? null,       // ✅ explicit null fallback
                        item_name: item.item,
                        category: item.type,
                        status: item.status,
                        message: item.message,
                        date_submitted: item.date_raw ? new Date(item.date_raw).toISOString().split("T")[0] : null,
                    })
                }).then(async res => {
                    if (!res.ok) {
                        const errBody = await res.json().catch(() => ({ message: res.statusText }));
                        console.error(`Failed for item ${item.id}:`, errBody); // ✅ see exact backend error
                        throw new Error(`Failed for item ${item.id}: ${errBody.message}`);
                    }
                    return res.json();
                })
            ));

            await fetchItemStatus();
            await fetchTrashItems();
            setSelectedItems([]);
            setEditMode(false);
            setShowDeletePopup(false);

        } catch (err) {
            console.error("Failed to move to trash:", err);
        }
    };

    const confirmDeleteForever = () => {
        const promises = selectedItems.map(id =>
            authFetch(`http://localhost:3000/api/user/trash/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` }
            })
        );

        Promise.all(promises)
            .then(() => {
                fetchTrashItems();
                setSelectedItems([]);
                setEditMode(false);
                setShowDeletePopup(false);
            })
            .catch(err => console.error("Failed to delete forever:", err));
    };

    const handleRestoreTrashItem = (id) => {
        authFetch(`http://localhost:3000/api/user/trash/${id}/restore`, {
            method: "POST",
            headers: { Authorization: `Bearer ${getToken()}` }
        })
            .then(async res => {
                if (!res.ok) {
                    const err = await res.json().catch(() => res.text());
                    console.error("Restore failed:", res.status, err);
                    return;
                }
                return res.json();
            })
            .then(() => {
                fetchItemStatus();
                fetchTrashItems();
            })
            .catch(err => console.error("Failed to restore:", err));
    };

    const filteredItems = (activeTab === "items" ? items : trashItems).filter(item => {
        if (!item || !item.status) return false;
        const matchStatus = filters.status ? item.status === filters.status : true;
        const matchType = filters.type ? item.type === filters.type : true;
        const matchKeyword = filters.keyword
            ? (item.item ?? "").toLowerCase().includes(filters.keyword.toLowerCase()) ||
            (item.message ?? "").toLowerCase().includes(filters.keyword.toLowerCase())
            : true;
        const itemDate = new Date(item.date);
        const from = filters.fromDate ? new Date(filters.fromDate) : null;
        const to = filters.toDate ? new Date(filters.toDate) : null;
        return matchStatus && matchType && matchKeyword &&
            (from ? itemDate >= from : true) &&
            (to ? itemDate <= to : true);
    });

    return (
        <div className="montserrat flex flex-col h-full bg-white">
            <span className="w-full h-0.5 bg-gray-200"></span>

            <div className="flex justify-between items-center my-1 py-2">
                <div className="flex gap-2 items-center">
                    <h1 className="text-lg text-[#646464] font-semibold">List of Items</h1>
                    <p className="text-[10px] text-[#047EAF] rounded-4xl bg-[#E8F7FF] px-3 py-0.5">
                        {filteredItems.length} Total Items
                    </p>
                </div>

                <div className="flex gap-2 items-center">
                    <div className="relative" ref={filterRef}>
                        <FilterButton
                            active={openFilter}
                            onClick={() => setOpenFilter(prev => !prev)}
                        />
                        {openFilter && (
                            <div className="absolute -top-17 right-23 mt-2 z-50">
                                <FilterPopup
                                    onApply={handleFilterApply}
                                    onClearAll={handleClearFilters}
                                    onClose={() => setOpenFilter(false)}
                                    initialFilters={filters}
                                />
                            </div>
                        )}
                    </div>

                    {!editMode ? (
                        <EditButton onClick={() => setEditMode(true)} />
                    ) : (
                        <>
                            {selectedItems.length > 0 ? (
                                <DeleteButton onClick={() => setShowDeletePopup(true)} />
                            ) : (
                                <DeleteButton onClick={() => setEditMode(false)} />
                            )}
                            <input
                                type="checkbox"
                                onChange={toggleSelectAll}
                                checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                            />
                            <p className="text-xs text-[#969696]">{selectedItems.length} Selected</p>
                        </>
                    )}
                </div>
            </div>

            <div className="flex gap-6 border-b border-[#D8D8D8] mb-3">
                <button
                    onClick={() => setActiveTab("items")}
                    className={`pb-2 font-semibold focus:outline-none focus:ring-0 ${activeTab === "items" ? "text-[#047EAF] border-b-2 border-[#047EAF]" : "text-gray-500"}`}
                >
                    Items
                </button>
                <button
                    onClick={() => setActiveTab("trash")}
                    className={`pb-2 font-semibold focus:outline-none focus:ring-0 ${activeTab === "trash" ? "text-[#047EAF] border-b-2 border-[#047EAF]" : "text-gray-500"}`}
                >
                    Trash
                </button>
            </div>

            {currentItems.length === 0 ? (
                <NoItemsYetLayout />
            ) : filteredItems.length === 0 ? (
                <NoItemFoundLayout onClear={handleClearSearch} />
            ) : (
                <ItemStatusLayout
                    items={filteredItems}
                    editMode={editMode}
                    selectedItems={selectedItems}
                    toggleSelect={toggleSelect}
                    isTrash={activeTab === "trash"}
                    onRestore={handleRestoreTrashItem}
                />
            )}

            {showDeletePopup && activeTab === "items" && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50" onClick={() => setShowDeletePopup(false)}>
                    <MoveToArchiveConfirmationPopup onClose={() => setShowDeletePopup(false)} onConfirm={confirmMoveToTrash} />
                </div>
            )}

            {showDeletePopup && activeTab === "trash" && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50" onClick={() => setShowDeletePopup(false)}>
                    <DeleteForeverConfirmationPopup onClose={() => setShowDeletePopup(false)} onConfirm={confirmDeleteForever} />
                </div>
            )}
        </div>
    );
}

export default ListOfItemLayout;