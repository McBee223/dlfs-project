import { useEffect, useRef, useState } from "react";
import ExitIcon from "../../../../assets/icons/ExitIcon.svg";
import FileUploadIcon from "../../../../assets/icons/FileUploadIcon.svg";
import DropdownIcon from "../../../../assets/icons/DropdownIcon.svg";

function AddItemPopup({ onClose, onSuccess }) {
    const modalRef = useRef();
    const categoryRef = useRef();

    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [itemNumber, setItemNumber] = useState("");
    const [itemName, setItemName] = useState("");
    const [category, setCategory] = useState("");
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [dateFound, setDateFound] = useState("");
    const [lastSeen, setLastSeen] = useState("");
    const [loading, setLoading] = useState(false);
    const [additionalInfo, setAdditionalInfo] = useState("");

    const categories = ["Bags", "Electronics", "Personal", "Document", "Clothes", "School Item"];

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

    const isFormValid = itemNumber && itemName && category && dateFound && lastSeen;

    const handleSubmit = async () => {
        if (!isFormValid) return;
        setLoading(true);

        const token = localStorage.getItem('adminToken');

        try {
            let imageUrl = '';
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);

                const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/upload-image`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData
                });

                const uploadData = await uploadRes.json();
                if (!uploadRes.ok) {
                    alert(uploadData.message || 'Image upload failed');
                    return;
                }
                imageUrl = uploadData.url;
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/lost-items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: itemNumber,
                    name: itemName,
                    category,
                    date_found: dateFound,
                    last_seen: lastSeen,
                    image: imageUrl,
                    additional_info: additionalInfo
                })
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.message || 'Failed to add item');
                return;
            }

            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            console.error('Submit error:', err);
            alert(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-1000">
                    <div className="w-12 h-12 2xl:w-14 2xl:h-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                <div
                    ref={modalRef}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="montserrat bg-white w-140 2xl:w-170 max-h-[90vh] rounded-2xl shadow-lg p-6 2xl:p-8 flex flex-col"
                >
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg 2xl:text-xl font-semibold">Add Item</p>
                        <button onClick={onClose} className="focus:outline-none focus:ring-0">
                            <img src={ExitIcon} alt="close" className="w-5 h-5 2xl:w-6 2xl:h-6" />
                        </button>
                    </div>

                    <div className={`overflow-y-auto pr-2 space-y-4 ${categoryOpen ? "pb-12" : "pb-0"}`}>

                        <div>
                            <label className="text-sm 2xl:text-base font-medium mb-1 block">Images</label>
                            <label className="flex flex-col items-center justify-center w-full h-44 2xl:h-52 border-2 border-dashed border-[#047EAF] rounded-xl cursor-pointer bg-[#E8F7FF] hover:bg-blue-50 transition">
                                {imagePreview ? (
                                    <img src={imagePreview} className="h-full object-contain rounded-lg" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <img src={FileUploadIcon} alt="upload" className="w-12 2xl:w-14 h-auto" />
                                        <span className="text-sm 2xl:text-base text-[#047EAF] underline">Browse files to upload</span>
                                    </div>
                                )}
                                <input type="file" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>

                        <div>
                            <label className="text-sm 2xl:text-base font-medium mb-1 block">
                                Item Number <span className="text-red-500">*</span>
                            </label>
                            <div className="flex w-full">
                                <input
                                    type="text"
                                    placeholder="0001"
                                    value={itemNumber}
                                    onChange={(e) => setItemNumber(e.target.value.replace(/^#/, ''))}
                                    className="input w-full rounded-l-none 2xl:py-3 2xl:text-base"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm 2xl:text-base font-medium mb-1 block">
                                Item Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Aquaflask Tumbler"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                className="input w-full 2xl:py-3 2xl:text-base"
                            />
                        </div>

                        <div>
                            <label className="text-sm 2xl:text-base font-medium mb-1 block">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <div className="relative" ref={categoryRef}>
                                <button
                                    type="button"
                                    onClick={() => setCategoryOpen(prev => !prev)}
                                    className="input w-full flex justify-between items-center focus:outline-none focus:ring-0 2xl:py-3 2xl:text-base"
                                >
                                    <span className={category ? "text-black" : "text-[#969696]"}>
                                        {category || "Select category"}
                                    </span>
                                    <img
                                        src={DropdownIcon}
                                        className={`w-4 h-4 2xl:w-5 2xl:h-5 transition-transform ${categoryOpen ? "rotate-180" : ""}`}
                                    />
                                </button>
                                {categoryOpen && (
                                    <div className="absolute top-12 left-0 w-full bg-white rounded-lg border border-[#D8D8D8] shadow-lg z-50 overflow-hidden">
                                        {categories.map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => { setCategory(c); setCategoryOpen(false); }}
                                                className="block w-full px-4 py-2.5 2xl:py-3 text-left text-sm 2xl:text-base hover:bg-gray-50 transition"
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm 2xl:text-base font-medium mb-1 block">
                                Date Found <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                value={dateFound}
                                onChange={(e) => setDateFound(e.target.value)}
                                className="input w-full 2xl:py-3 2xl:text-base"
                            />
                        </div>

                        <div>
                            <label className="text-sm 2xl:text-base font-medium mb-1 block">
                                Last Seen <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Room 209"
                                value={lastSeen}
                                onChange={(e) => setLastSeen(e.target.value)}
                                className="input w-full 2xl:py-3 2xl:text-base"
                            />
                        </div>

                        <div>
                            <label className="text-sm 2xl:text-base font-medium mb-1 block">
                                Additional Information <span className="text-gray-400 text-xs 2xl:text-sm font-normal">(Optional)</span>
                            </label>
                            <textarea
                                placeholder="Any extra details about the item..."
                                value={additionalInfo}
                                onChange={(e) => setAdditionalInfo(e.target.value)}
                                rows={4}
                                className="input w-full resize-none 2xl:py-3 2xl:text-base"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid || loading}
                        className="mt-5 w-full bg-[#047EAF] text-white py-2.5 2xl:py-3 2xl:text-lg rounded-xl font-semibold focus:outline-none focus:ring-0 disabled:opacity-60"
                    >
                        Add Item
                    </button>

                    {!isFormValid && (
                        <p className="text-xs 2xl:text-sm text-red-500 mt-1">Please fill up everything first</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default AddItemPopup;




