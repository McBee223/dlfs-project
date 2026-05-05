import { useState, useEffect, useRef } from "react";
import { authFetch } from "../../../../utils/authFetch";
import ExitIcon from "../../../../assets/icons/ExitIcon.svg";
import FileUploadIcon from '../../../../assets/icons/FileUploadIcon.svg';

function ClaimItemPopup({ item, onClose, onSuccess, claimId }) {
    const modalRef = useRef();
    const isEditing = !!claimId;

    const [step, setStep] = useState("claim");
    const [animating, setAnimating] = useState(false);
    const [brand, setBrand] = useState("");
    const [lastSeen, setLastSeen] = useState("");
    const [date, setDate] = useState("");
    const [itemCondition, setItemCondition] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("#000000");
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fromDay] = useState("Monday");
    const [toDay] = useState("Friday");
    const [location] = useState("2nd Floor Administrative Office");
    const [scheduleTime] = useState("8:00 AM - 9:00 AM, 1:00 PM - 5:00 PM");
    const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
    const [pickupDate, setPickupDate] = useState("");
    const [pickupTime, setPickupTime] = useState("");

    const timeSlots = ["8:00 AM - 9:00 AM", "9:00 AM - 10:00 AM", "10:00 AM - 11:30 AM", "1:00 PM - 2:00 PM", "2:00 PM - 3:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM"];

    useEffect(() => {
        if (!claimId) return;
        const token = localStorage.getItem("userToken");
        authFetch(`http://localhost:3000/api/user/claims/${claimId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.claim) {
                    const c = data.claim;
                    setBrand(c.brand || "");
                    setLastSeen(c.last_seen || "");
                    setDate(c.date_lost ? c.date_lost.substring(0, 16) : "");
                    setItemCondition(c.item_condition || "");
                    setDescription(c.description || "");
                    setColor(c.color || "#000000");
                    setPickupDate(c.pickup_date ? (() => {
                        const d = new Date(c.pickup_date);
                        const ph = new Date(d.getTime() + (8 * 60 * 60 * 1000));
                        return ph.toISOString().substring(0, 10);
                    })() : "");
                    setPickupTime(c.pickup_time || "");
                    if (c.image) setImagePreview(c.image);
                }
            })
            .catch(err => console.error("Failed to fetch claim:", err));
    }, [claimId]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
            else setTimeDropdownOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!item) return null;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const isClaimFormValid = brand && lastSeen && date && itemCondition && description;
    const isScheduleValid = pickupDate && pickupTime;

    const goToSchedule = () => {
        if (!isClaimFormValid) { alert("Please fill all required fields first."); return; }
        setAnimating(true);
        setTimeout(() => { setStep("schedule"); setAnimating(false); }, 320);
    };

    const handleSubmit = async () => {
        if (!isScheduleValid) { alert("Please fill in your pick-up date and time."); return; }
        setLoading(true);

        let imageBase64 = null;
        if (imageFile) {
            imageBase64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const maxWidth = 400;
                        const scale = maxWidth / img.width;
                        canvas.width = maxWidth;
                        canvas.height = img.height * scale;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        resolve(canvas.toDataURL('image/jpeg', 0.5));
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(imageFile);
            });
        }

        const token = localStorage.getItem('userToken');
        const payload = {
            lost_item_id: item.id, brand, last_seen: lastSeen, date_lost: date,
            item_condition: itemCondition, description, color,
            image: imageBase64, pickup_date: pickupDate, pickup_time: pickupTime,
        };

        try {
            const url = isEditing
                ? `http://localhost:3000/api/user/claims/${claimId}`
                : "http://localhost:3000/api/user/claims";
            const method = isEditing ? "PUT" : "POST";

            const res = await authFetch(url, {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setTimeout(() => { onSuccess(); }, 500);
            } else {
                const data = await res.json();
                alert(data.message || "Failed to submit claim.");
            }
        } catch (err) {
            console.error("Claim error:", err);
            alert("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @keyframes slideOutLeft {
                    from { opacity: 1; transform: translateX(0); }
                    to   { opacity: 0; transform: translateX(-40px); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(40px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                .slide-out-left { animation: slideOutLeft 0.28s cubic-bezier(.4,0,.2,1) forwards; }
                .slide-in-right { animation: slideInRight 0.32s cubic-bezier(.4,0,.2,1) forwards; }
                .schedule-divider { border: none; border-top: 1px solid #E8E8E8; margin: 18px 0 16px; }
                .readonly-field {
                    width: 100%; border-radius: 8px; border: 1px solid #E8E8E8;
                    padding: 10px 14px; font-size: 0.875rem; color: #888;
                    background: #F5F5F5; pointer-events: none; outline: none; box-sizing: border-box;
                }
                .schedule-label { font-size: 0.72rem; color: #646464; font-weight: 500; margin-bottom: 5px; display: block; }
                .schedule-input {
                    width: 100%; border-radius: 8px; border: 1px solid #D8D8D8;
                    padding: 10px 14px; font-size: 0.875rem; color: #323232;
                    background: #fff; outline: none; box-sizing: border-box; transition: border-color 0.15s;
                }
                .schedule-input:focus { border-color: #047EAF; }
                input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.6; cursor: pointer; }
            `}</style>

            {loading && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.35)] flex items-center justify-center z-1000">
                    <div className="w-12 h-12 2xl:w-16 2xl:h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <div className="montserrat fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-500">
                <div ref={modalRef} onMouseDown={(e) => e.stopPropagation()} className="bg-white w-120 2xl:w-176 h-[90vh] 2xl:h-[90vh] rounded-2xl shadow-lg flex flex-col overflow-hidden">
                    {step === "claim" && (
                        <div className={`flex flex-col flex-1 min-h-0 p-6 2xl:p-8 ${animating ? "slide-out-left" : ""}`}>
                            <div className="flex justify-between items-center mb-4 2xl:mb-6 shrink-0">
                                <p className="text-lg 2xl:text-2xl font-semibold">{isEditing ? "Edit Your Submission" : "Your Item Details"}</p>
                                <button onClick={onClose}><img src={ExitIcon} alt="close" className="w-6 2xl:w-8" /></button>
                            </div>

                            <div className="overflow-y-auto flex-1 space-y-4 2xl:space-y-5 pr-2">
                                <div className="flex flex-col">
                                    <label className="mb-1 2xl:mb-2 font-medium 2xl:text-lg">Brand / Model <span className="text-red-500">*</span></label>
                                    <input className="input w-full 2xl:px-5 2xl:py-4 2xl:text-lg 2xl:mb-6" placeholder="e.g., Aquafast 32oz, iPhone 11" value={brand} onChange={(e) => setBrand(e.target.value)} />
                                </div>
                                <div className="flex flex-col">
                                    <label className="mb-1 2xl:mb-2 font-medium 2xl:text-lg">Last Seen <span className="text-red-500">*</span></label>
                                    <input className="input w-full 2xl:px-5 2xl:py-4 2xl:text-lg 2xl:mb-6" placeholder="e.g., Room 304, library" value={lastSeen} onChange={(e) => setLastSeen(e.target.value)} />
                                </div>
                                <div className="flex flex-col">
                                    <label className="mb-1 2xl:mb-2 font-medium 2xl:text-lg">Date & Time <span className="text-red-500">*</span></label>
                                    <input type="datetime-local" className="input w-full 2xl:px-5 2xl:py-4 2xl:text-lg 2xl:mb-6" value={date} onChange={(e) => setDate(e.target.value)} />
                                </div>
                                <div className="flex flex-col">
                                    <label className="mb-1 2xl:mb-2 font-medium 2xl:text-lg">Condition <span className="text-red-500">*</span></label>
                                    <input className="input w-full 2xl:px-5 2xl:py-4 2xl:text-lg 2xl:mb-6" placeholder="e.g., good, slightly scratched" value={itemCondition} onChange={(e) => setItemCondition(e.target.value)} />
                                </div>
                                <div className="flex flex-col">
                                    <label className="mb-1 2xl:mb-2 font-medium 2xl:text-lg">Description <span className="text-red-500">*</span></label>
                                    <textarea className="input w-full 2xl:px-5 2xl:py-4 2xl:text-lg 2xl:mb-6 h-24 2xl:h-36 resize-none" placeholder="Unique features or what's inside?" value={description} onChange={(e) => setDescription(e.target.value)} />
                                </div>
                                <div className="flex flex-col">
                                    <label className="mb-1 2xl:mb-2 font-medium 2xl:text-lg">Color</label>
                                    <input type="color" className="w-10 h-10 2xl:w-14 2xl:h-14 p-0 border rounded cursor-pointer" value={color} onChange={(e) => setColor(e.target.value)} />
                                </div>
                                <label className="flex flex-col items-center justify-center w-full h-40 2xl:h-56 border-2 border-dashed rounded-xl cursor-pointer bg-[#E8F7FF] hover:bg-gray-50 transition">
                                    {imagePreview ? (
                                        <img src={imagePreview} className="h-full object-contain rounded-lg" alt="preview" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 2xl:gap-3">
                                            <img src={FileUploadIcon} alt="upload" className="w-12 2xl:w-16 h-auto" />
                                            <span className="text-[#00658D] underline 2xl:text-lg">Browse files to upload</span>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>

                            <div className="shrink-0 pt-4 2xl:pt-5">
                                <button onClick={goToSchedule} disabled={!isClaimFormValid || loading} className="w-full bg-[#00658D] text-white py-2 2xl:py-3 2xl:text-lg rounded hover:bg-[#156394] disabled:opacity-60 transition-colors font-medium">
                                    Next
                                </button>
                                {!isClaimFormValid && <p className="text-xs 2xl:text-sm text-red-500 mt-1 2xl:mt-2">Please fill up everything first</p>}
                            </div>
                        </div>
                    )}

                    {step === "schedule" && (
                        <div className="slide-in-right flex flex-col flex-1 min-h-0 p-6 2xl:p-8">
                            <div className="flex justify-between items-center mb-5 2xl:mb-7 shrink-0">
                                <h2 className="text-lg 2xl:text-2xl font-semibold text-[#1a1a1a]">Schedule</h2>
                                <button onClick={onClose}><img src={ExitIcon} className="w-5 h-5 2xl:w-7 2xl:h-7" alt="close" /></button>
                            </div>

                            <div className="overflow-y-auto flex-1 pr-1">
                                <p className="text-sm 2xl:text-base font-semibold text-[#1a1a1a] mb-3 2xl:mb-5">Available Dates & Times</p>

                                <div className="bg-gray-50 rounded-xl p-4 2xl:p-5 2xl:mb-6 mb-4 space-y-3 2xl:space-y-4 border border-[#E8E8E8]">
                                    <div className="flex gap-3 2xl:gap-4">
                                        <div className="flex-1">
                                            <p className="2xl:text-base mb-2">From</p>
                                            <input className="input 2xl:px-5 2xl:py-4 readonly-field 2xl:text-lg" value={fromDay} readOnly />
                                        </div>
                                        <div className="flex-1">
                                            <p className="2xl:text-base mb-2">To</p>
                                            <input className="input 2xl:px-5 2xl:py-4 readonly-field 2xl:text-lg" value={toDay} readOnly />
                                        </div>
                                    </div>
                                    <div>
                                        <spp className="2xl:text-base mb-2">Location</spp>
                                        <input className="input 2xl:px-5 2xl:py-4 readonly-field 2xl:text-lg mt-2" value={location} readOnly />
                                    </div>
                                    <div>
                                        <spp className="2xl:text-base mb-2">Time</spp>
                                        <input className="input 2xl:px-5 2xl:py-4 readonly-field 2xl:text-lg mt-2" value={scheduleTime} readOnly />
                                    </div>
                                </div>

                                <hr className="schedule-divider" />

                                <p className="text-sm 2xl:text-base font-semibold text-[#047EAF] mb-1 2xl:mb-2">Your Schedule</p>
                                <p className="text-xs 2xl:text-sm text-gray-400">Please fill in your preferred pickup schedule.</p>

                                <div className="bg-white rounded-xl p-4 2xl:p-5 space-y-4 2xl:space-y-5">
                                    <div>
                                        <span className="2xl:text-base text-sm">Date of pick up <span className="text-red-500">*</span></span>
                                        <input
                                            type="date"
                                            className="input 2xl:px-5 2xl:py-4 2xl:text-base mt-1 2xl:mt-2"
                                            value={pickupDate}
                                            onChange={(e) => setPickupDate(e.target.value)}
                                        />
                                    </div>

                                    <div className="relative">
                                        <span className="2xl:text-base text-sm">Time <span className="text-red-500">*</span></span>
                                        <button
                                            type="button"
                                            onClick={() => setTimeDropdownOpen(prev => !prev)}
                                            className="input 2xl:px-5 2xl:py-4 2xl:text-base mt-1 2xl:mt-2 flex items-center justify-between text-left cursor-pointer"
                                        >
                                            <span style={{ color: pickupTime ? '#323232' : '#9ca3af' }}>
                                                {pickupTime || 'Select a time slot'}
                                            </span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                                fill="none" stroke="#323232" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                                                style={{ transition: 'transform 0.2s', transform: timeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                        </button>
                                        {timeDropdownOpen && (
                                            <div className="absolute z-50 w-full mt-1 bg-white border border-[#D8D8D8] rounded-xl shadow-lg overflow-hidden" style={{ top: '100%' }}>
                                                {timeSlots.map(slot => (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        onClick={() => { setPickupTime(slot); setTimeDropdownOpen(false); }}
                                                        className="w-full text-left px-4 py-2.5 2xl:px-5 2xl:py-3 text-sm 2xl:text-base transition-colors"
                                                        style={{
                                                            color: slot === pickupTime ? '#047EAF' : '#323232',
                                                            background: slot === pickupTime ? '#E8F7FF' : 'transparent',
                                                            fontWeight: slot === pickupTime ? '600' : '400'
                                                        }}
                                                        onMouseEnter={e => { if (slot !== pickupTime) e.currentTarget.style.background = '#f5f5f5'; }}
                                                        onMouseLeave={e => { if (slot !== pickupTime) e.currentTarget.style.background = 'transparent'; }}
                                                    >
                                                        {slot}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 pt-4 2xl:pt-5 flex gap-2 2xl:gap-3">
                                <button onClick={() => setStep("claim")} className="flex-1 border border-[#D8D8D8] text-[#323232] py-2 2xl:py-3 rounded-xl font-medium text-sm 2xl:text-base hover:bg-gray-50">Back</button>
                                <button onClick={handleSubmit} disabled={!isScheduleValid || loading} className="flex-1 bg-[#047EAF] text-white py-2 2xl:py-3 rounded-xl font-semibold text-sm 2xl:text-base hover:bg-[#0369a1] disabled:opacity-60">
                                    {isEditing ? "Update Submission" : "Submit Claim"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default ClaimItemPopup;