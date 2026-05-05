import { useEffect, useRef, useState } from "react";
import ExitIcon from "../../../../assets/icons/ExitIcon.svg";
import ApproveClaimImage from "../../../../assets/images/ApproveClaimImage.png";
import RejectClaimImage from "../../../../assets/images/RejectClaimImage.png";
import RejectClaimRequestPopup from "./RejectClaimRequestPopup";

function ViewSubmissionDetailsPopup({ item, onClose, onApprove, onReject }) {
    const modalRef = useRef();
    const [step, setStep] = useState("details");
    const [animating, setAnimating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
    const [rejectPending, setRejectPending] = useState(false);

    const [fromDay] = useState("Monday");
    const [toDay] = useState("Friday");
    const [location] = useState("2nd Floor Administrative Office");
    const [scheduleTime] = useState("8:00 AM - 9:00 AM, 1:00 PM - 5:00 PM");

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (rejectPending) return;
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            } else {
                setTimeDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose, rejectPending]);

    if (!item) return null;

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const d = new Date(dateStr);
        if (isNaN(d)) return dateStr;
        return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    const goToSchedule = () => {
        setAnimating(true);
        setTimeout(() => { setStep("schedule"); setAnimating(false); }, 320);
    };

    const handleApprove = async () => {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/claims/${item.claimDbId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: "Approved" })
            });
            if (res.ok) { onApprove(item); onClose(); }
            else { const d = await res.json(); alert(d.message || "Failed to approve."); }
        } catch { alert("Something went wrong."); }
        finally { setLoading(false); }
    };

    const handleReject = async () => {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/claims/${item.claimDbId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status: "Rejected" })
            });
            if (res.ok) { onReject(item); onClose(); }
            else { const d = await res.json(); alert(d.message || "Failed to reject."); }
        } catch { alert("Something went wrong."); }
        finally { setLoading(false); }
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
                    width: 100%; border-radius: 8px; border: 1px solid #D8D8D8;
                    padding: 10px 14px; font-size: 0.875rem; color: #323232;
                    background: #fff; pointer-events: none; outline: none; box-sizing: border-box;
                }
                .schedule-label { font-size: 0.72rem; color: #646464; font-weight: 500; margin-bottom: 5px; display: block; }
                .schedule-input {
                    width: 100%; border-radius: 8px; border: 1px solid #D8D8D8;
                    padding: 10px 14px; font-size: 0.875rem; color: #323232;
                    background: #fff; outline: none; box-sizing: border-box;
                }
            `}</style>

            {loading && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.35)] flex items-center justify-center z-1000">
                    <div className="w-12 h-12 2xl:w-14 2xl:h-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            <div
                className="fixed inset-0 bg-[rgba(0,0,0,0.3)] items-center justify-center z-500"
                style={{ display: rejectPending ? "none" : "flex" }}
            >
                <div
                    ref={modalRef}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="bg-white w-120 2xl:w-136 h-[90vh] 2xl:h-[92vh] rounded-2xl shadow-lg flex flex-col overflow-hidden"
                >
                    {step === "details" && (
                        <div className={`flex flex-col flex-1 min-h-0 p-6 2xl:p-8 ${animating ? "slide-out-left" : ""}`}>
                            <div className="flex justify-between items-center mb-4 2xl:mb-5 shrink-0">
                                <p className="text-lg 2xl:text-xl font-semibold">Submission Details</p>
                                <button onClick={onClose}>
                                    <img src={ExitIcon} alt="close" className="w-6 2xl:w-7" />
                                </button>
                            </div>

                            <div className="overflow-y-auto flex-1 space-y-3 2xl:space-y-4 pr-2">
                                <div>
                                    <label className="text-xs 2xl:text-sm text-gray-500">Name</label>
                                    <div className="input">{item.claimant}</div>
                                </div>
                                <div>
                                    <label className="text-xs 2xl:text-sm text-gray-500">Item Name</label>
                                    <div className="input">{item.itemName || item.item_name}</div>
                                </div>
                                <div>
                                    <label className="text-xs 2xl:text-sm text-gray-500">Brand / Model</label>
                                    <div className="input">{item.brand || "-"}</div>
                                </div>
                                <div>
                                    <label className="text-xs 2xl:text-sm text-gray-500">Last Seen</label>
                                    <div className="input">{item.lastSeen || item.last_seen}</div>
                                </div>
                                <div>
                                    <label className="text-xs 2xl:text-sm text-gray-500">Date & Time</label>
                                    <div className="input">{formatDate(item.dateSubmitted || item.date_submitted)}</div>
                                </div>
                                <div>
                                    <label className="text-xs 2xl:text-sm text-gray-500">Condition</label>
                                    <div className="input">{item.item_condition || "-"}</div>
                                </div>
                                <div>
                                    <label className="text-xs 2xl:text-sm text-gray-500">Description</label>
                                    <div className="input min-h-20 2xl:min-h-24">{item.description || "-"}</div>
                                </div>
                                <div>
                                    <label className="text-xs 2xl:text-sm text-gray-500">Color</label>
                                    <div className="w-8 h-8 2xl:w-10 2xl:h-10 rounded border" style={{ backgroundColor: item.color || "#ccc" }} />
                                </div>
                                {item.claimImage && (
                                    <div className="mt-2 2xl:mt-3">
                                        <label className="text-xs 2xl:text-sm text-gray-500">Submitted Image</label>
                                        <img src={item.claimImage} alt="submitted" className="w-full h-40 2xl:h-52 object-cover rounded-xl mt-1" />
                                    </div>
                                )}
                            </div>

                            <div className="shrink-0 pt-4 2xl:pt-5">
                                <button
                                    onClick={goToSchedule}
                                    className="w-full bg-[#00658D] text-white py-2 2xl:py-3 rounded-xl hover:bg-[#156394] transition-colors font-medium text-sm 2xl:text-base"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {step === "schedule" && (
                        <div className="slide-in-right flex flex-col flex-1 min-h-0 p-6 2xl:p-8">
                            <div className="flex justify-between items-center mb-5 2xl:mb-6 shrink-0">
                                <h2 className="text-lg 2xl:text-xl font-semibold text-[#1a1a1a]">Schedule</h2>
                                <button onClick={onClose}>
                                    <img src={ExitIcon} className="w-5 h-5 2xl:w-6 2xl:h-6" alt="close" />
                                </button>
                            </div>

                            <div className="overflow-y-auto flex-1 pr-1">
                                <p className="text-sm 2xl:text-base font-semibold text-[#1a1a1a] mb-4 2xl:mb-5">Available Dates &amp; Times</p>

                                <div className="flex gap-3 2xl:gap-4 mb-4 2xl:mb-5">
                                    <div className="flex-1">
                                        <span className="schedule-label">From</span>
                                        <input className="readonly-field" value={fromDay} readOnly />
                                    </div>
                                    <div className="flex-1">
                                        <span className="schedule-label">To</span>
                                        <input className="readonly-field" value={toDay} readOnly />
                                    </div>
                                </div>

                                <div className="mb-4 2xl:mb-5">
                                    <span className="schedule-label">Location</span>
                                    <input className="readonly-field" value={location} readOnly />
                                </div>

                                <div className="mb-4 2xl:mb-5">
                                    <span className="schedule-label">Time</span>
                                    <input className="readonly-field" value={scheduleTime} readOnly />
                                </div>

                                <hr className="schedule-divider" />

                                <p className="text-sm 2xl:text-base font-semibold text-[#1a1a1a] mb-4 2xl:mb-5">User's Preferred Schedule</p>

                                <div className="mb-4 2xl:mb-5">
                                    <span className="schedule-label">Date of Pick-up</span>
                                    <input
                                        className="readonly-field"
                                        value={item.pickup_date ? (() => {
                                            const d = new Date(item.pickup_date);
                                            const ph = new Date(d.getTime() + (8 * 60 * 60 * 1000));
                                            return ph.toISOString().substring(0, 10).split('-').reverse().join('-');
                                        })() : '-'}
                                        readOnly
                                    />
                                </div>

                                <div className="mb-4 2xl:mb-5">
                                    <span className="schedule-label">Time</span>
                                    <input className="readonly-field" value={item.pickup_time || '-'} readOnly />
                                </div>
                            </div>

                            <div className="shrink-0 pt-4 2xl:pt-5 flex items-center justify-between">
                                <button
                                    onClick={() => setStep("details")}
                                    className="text-sm 2xl:text-base text-[#646464] hover:text-[#323232] transition-colors flex items-center gap-1 2xl:gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="2xl:w-4 2xl:h-4" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                    Back
                                </button>

                                <div className="flex gap-3 2xl:gap-4">
                                    <button
                                        onClick={handleApprove}
                                        disabled={loading}
                                        className="transition-transform duration-150 hover:scale-110 disabled:opacity-60"
                                    >
                                        <img src={ApproveClaimImage} alt="approve" className="h-10 2xl:h-12" />
                                    </button>
                                    <button
                                        onClick={() => setRejectPending(true)}
                                        disabled={loading}
                                        className="transition-transform duration-150 hover:scale-110 disabled:opacity-60"
                                    >
                                        <img src={RejectClaimImage} alt="reject" className="h-10 2xl:h-12" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {rejectPending && (
                <RejectClaimRequestPopup
                    onClose={() => setRejectPending(false)}
                    onConfirm={() => {
                        setRejectPending(false);
                        handleReject();
                    }}
                />
            )}
        </>
    );
}

export default ViewSubmissionDetailsPopup;

