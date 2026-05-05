import { useEffect, useRef, useState } from "react";
import ExitIcon from "../../../../assets/icons/ExitIcon.svg";
import DropdownIcon from "../../../../assets/icons/DropdownIcon.svg";
import EditButton from "../../../ui/adminUI/buttons/EditButton";
import SaveButton from "../../../ui/adminUI/buttons/SaveButton";
import SampleImage from "../../../../assets/images/headphoneImage.jpg";

const normalizeToDatetimeLocal = (val) => {
    if (!val) return "";
    if (val instanceof Date) return val.toISOString().slice(0, 16);
    const str = String(val);
    if (str.includes("T")) return str.slice(0, 16);
    return str.replace(" ", "T").slice(0, 16);
};

function ViewItemPopup({ onClose, onSave, item }) {
    const modalRef = useRef();
    const categoryRef = useRef();
    const canEdit = item?.canEdit;

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [originalId] = useState(item?.id || item?.claimId || "");
    const [imageFile, setImageFile] = useState(null);
    const [itemNumber] = useState(item?.itemNumber || item?.id || item?.claimId || "");
    const [itemName, setItemName] = useState(item?.name || item?.itemName || "");
    const [category, setCategory] = useState(item?.category || "");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [dateFound, setDateFound] = useState(
        normalizeToDatetimeLocal(item?.dateFound || item?.date_found || "")
    );
    const [lastSeen, setLastSeen] = useState(item?.lastSeen || item?.last_seen || "");
    const [additionalInfo, setAdditionalInfo] = useState(
        item?.additionalInfo || item?.additional_info || ""
    );
    const [imagePreview, setImagePreview] = useState(
        item?.image && item.image !== "" ? item.image : SampleImage
    );

    const categories = ["Bags", "Electronics", "Personal", "Document", "Clothes", "School Item"];

    useEffect(() => {
        const isTrashItem = !!item?.trashDbId || !!item?.sourceTab;

        if (isTrashItem) {
            if (item?.image && item.image !== "") setImagePreview(item.image);
            if (item?.dateFound || item?.date_found)
                setDateFound(normalizeToDatetimeLocal(item?.dateFound || item?.date_found));
            if (item?.lastSeen || item?.last_seen)
                setLastSeen(item?.lastSeen || item?.last_seen || "");
            if (item?.additionalInfo || item?.additional_info)
                setAdditionalInfo(item?.additionalInfo || item?.additional_info || "");
            return;
        }

        const alreadyComplete = !!(
            (item?.dateFound || item?.date_found) &&
            (item?.lastSeen || item?.last_seen) &&
            (item?.image && item.image !== "")
        );
        if (alreadyComplete) return;

        const rawId = item?.lostItemId || item?.lost_item_id;
        if (!rawId) return;

        const lostId = String(rawId).replace(/^0+/, '');
        if (!lostId) return;

        const token = localStorage.getItem('adminToken');
        setIsLoading(true);
        fetch(`http://localhost:3000/api/admin/lost-items/${lostId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.item) {
                    const d = data.item;
                    if (!dateFound) setDateFound(normalizeToDatetimeLocal(d.date_found || ""));
                    if (!lastSeen) setLastSeen(d.last_seen || "");
                    if (!additionalInfo) setAdditionalInfo(d.additional_info || "");
                    if (!item?.image || item.image === "") {
                        setImagePreview(d.image && d.image !== "" ? d.image : SampleImage);
                    }
                }
            })
            .catch(() => {})
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
            if (categoryRef.current && !categoryRef.current.contains(e.target)) setCategoryOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('adminToken');
        setIsSaving(true);

        try {
            let finalImageUrl = imagePreview === SampleImage ? "" : imagePreview;
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);

                const uploadRes = await fetch('http://localhost:3000/api/admin/upload-image', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData
                });

                const uploadData = await uploadRes.json();
                if (!uploadRes.ok) {
                    alert(uploadData.message || 'Image upload failed');
                    return;
                }
                finalImageUrl = uploadData.url;
            }

            const res = await fetch(`http://localhost:3000/api/admin/lost-items/${originalId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: itemName,
                    category,
                    date_found: dateFound,
                    last_seen: lastSeen,
                    image: finalImageUrl,
                    status: item.status || 'Unclaimed',
                    additional_info: additionalInfo
                })
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.message || 'Failed to update item');
                return;
            }

            onSave?.({
                ...item,
                id: originalId,
                originalId,
                name: itemName,
                itemName,
                category,
                dateFound,
                lastSeen,
                image: finalImageUrl,
                additional_info: additionalInfo,
            });

            setIsEditing(false);
            onClose();
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            {(isSaving || isLoading) && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-1000">
                    <div className="w-12 h-12 2xl:w-14 2xl:h-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                <div
                    ref={modalRef}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="montserrat bg-white w-140 2xl:w-160 max-h-[90vh] rounded-2xl shadow-lg p-6 2xl:p-8 flex flex-col"
                >
                    <div className="flex justify-between items-center mb-4 2xl:mb-5">
                        <p className="text-lg 2xl:text-xl font-semibold">Item Details</p>
                        <button onClick={onClose}>
                            <img src={ExitIcon} className="w-5 h-5 2xl:w-6 2xl:h-6" />
                        </button>
                    </div>

                    <div className={`overflow-y-auto pr-2 space-y-4 2xl:space-y-5 ${categoryOpen ? "pb-15" : ""}`}>
                        <div>
                            <label className="text-sm 2xl:text-base font-medium mb-1 block">Image</label>
                            {isEditing ? (
                                <label className="flex flex-col items-center justify-center w-full h-44 2xl:h-52 border-2 border-dashed border-[#047EAF] rounded-xl cursor-pointer bg-[#E8F7FF]">
                                    <img src={imagePreview} className="h-full object-contain rounded-lg" />
                                    <input type="file" className="hidden" onChange={handleImageUpload} />
                                </label>
                            ) : (
                                <div className="w-full h-44 2xl:h-52 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                                    <img src={imagePreview} className="h-full object-contain" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="text-sm 2xl:text-base font-medium mb-1 block">Item Number</label>
                            <input type="text" value={itemNumber} disabled className="input w-full bg-white 2xl:text-sm" />
                        </div>

                        <div>
                            <label className="text-sm 2xl:text-base font-medium mb-1 block">Item Name</label>
                            <input
                                type="text"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                disabled={!isEditing}
                                className={`input w-full 2xl:text-sm ${isEditing ? "bg-gray-100" : "bg-white"}`}
                            />
                        </div>

                        <div>
                            <label className="text-sm 2xl:text-base font-medium mb-1 block">Category</label>
                            <div className="relative" ref={categoryRef}>
                                <button
                                    type="button"
                                    disabled={!isEditing}
                                    onClick={() => setCategoryOpen(prev => !prev)}
                                    className={`input w-full flex justify-between items-center 2xl:text-sm ${isEditing ? "bg-gray-100 cursor-pointer" : "bg-white cursor-default"}`}
                                >
                                    <span>{category || "Select category"}</span>
                                    <img src={DropdownIcon} className={`w-4 h-4 2xl:w-5 2xl:h-5 transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
                                </button>
                                {categoryOpen && isEditing && (
                                    <div className="absolute top-12 2xl:top-13 left-0 w-full bg-white border rounded-lg shadow-lg z-50">
                                        {categories.map((c) => (
                                            <button
                                                key={c}
                                                onClick={() => { setCategory(c); setCategoryOpen(false); }}
                                                className="block w-full px-4 py-2 2xl:px-5 2xl:py-2.5 text-left text-sm 2xl:text-base hover:bg-gray-100 hover:rounded-lg"
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm 2xl:text-base font-medium mb-1 block">Date Found</label>
                            <input
                                type="datetime-local"
                                value={dateFound}
                                onChange={(e) => setDateFound(e.target.value)}
                                disabled={!isEditing}
                                className={`input w-full 2xl:text-sm ${isEditing ? "bg-gray-100" : "bg-white"}`}
                            />
                        </div>

                        <div>
                            <label className="text-sm 2xl:text-base font-medium mb-1 block">Last Seen</label>
                            <input
                                type="text"
                                value={lastSeen}
                                onChange={(e) => setLastSeen(e.target.value)}
                                disabled={!isEditing}
                                className={`input w-full 2xl:text-sm ${isEditing ? "bg-gray-100" : "bg-white"}`}
                            />
                        </div>

                        <div>
                            <label className="text-sm 2xl:text-base font-medium mb-1 block">
                                Additional Information{" "}
                                <span className="text-gray-400 text-xs 2xl:text-sm font-normal">(Optional)</span>
                            </label>
                            <textarea
                                value={additionalInfo}
                                onChange={(e) => setAdditionalInfo(e.target.value)}
                                disabled={!isEditing}
                                rows={4}
                                className={`input w-full resize-none 2xl:text-sm ${isEditing ? "bg-gray-100" : "bg-white"}`}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end items-center mt-5 2xl:mt-6">
                        {isEditing ? (
                            <SaveButton onClick={handleSave} disabled={isSaving} />
                        ) : (
                            canEdit && <EditButton onClick={() => setIsEditing(true)} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ViewItemPopup;