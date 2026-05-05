import { useState, useRef, useEffect } from "react";

import DropdownIcon from '../../../../assets/icons/DropdownIcon.svg';
import ExitIcon from '../../../../assets/icons/ExitIcon.svg';
import SearchIcon from '../../../../assets/icons/SearchIcon.svg';

function FilterPopup({ onApply, onClose, initialFilters, onClearAll }) {

    const statusOptions = ["In Process", "Rejected", "Claimed", "Approved"];
    const typeOptions = ["Electronics", "Personal", "Document", "Clothes", "Bag", "School Item"];

    const popupRef = useRef(null);
    const statusRef = useRef(null);
    const typeRef = useRef(null);

    const [statusOpen, setStatusOpen] = useState(false);
    const [typeOpen, setTypeOpen] = useState(false);

    const [status, setStatus] = useState(initialFilters.status);
    const [type, setType] = useState(initialFilters.type);
    const [fromDate, setFromDate] = useState(initialFilters.fromDate);
    const [toDate, setToDate] = useState(initialFilters.toDate);
    const [keyword, setKeyword] = useState(initialFilters.keyword);

    const handleApply = () => {
        onApply({ status, type, fromDate, toDate, keyword });
    };

    const handleClearAllLocal = () => {
        setStatus("");
        setType("");
        setFromDate("");
        setToDate("");
        setKeyword("");
        onClearAll();
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                onClose();
            }
            if (statusRef.current && !statusRef.current.contains(e.target)) {
                setStatusOpen(false);
            }
            if (typeRef.current && !typeRef.current.contains(e.target)) {
                setTypeOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={popupRef}
            onClick={(e) => e.stopPropagation()}
            className="montserrat w-100 2xl:w-140 bg-white rounded-2xl shadow-lg p-5 2xl:p-6"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-700 2xl:text-lg">Filter</h2>
                <button onClick={onClose}>
                    <img src={ExitIcon} className="w-6 h-6 2xl:w-7 2xl:h-7" />
                </button>
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-sm 2xl:text-base text-gray-500 mb-1">
                    <span>Select Date</span>
                    <button
                        onClick={() => { setFromDate(""); setToDate(""); }}
                        className="text-[#047EAF] text-sm 2xl:text-base"
                    >
                        Clear
                    </button>
                </div>
                <p className="text-xs 2xl:text-sm text-gray-400 mb-2">
                    Optional range filter (you can set only From or only To)
                </p>
                <div className="flex gap-2">
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="input 2xl:px-5 2xl:py-4 2xl:text-base 2xl:mb-1 w-full"
                    />
                    <input
                        type="date"
                        value={toDate}
                        min={fromDate || undefined}
                        onChange={(e) => setToDate(e.target.value)}
                        className="input 2xl:px-5 2xl:py-4 2xl:text-base 2xl:mb-1 w-full"
                    />
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-sm 2xl:text-base text-gray-500 mb-2">
                    <span>Status</span>
                    <button onClick={() => setStatus("")} className="text-[#047EAF] text-sm 2xl:text-base">
                        Clear
                    </button>
                </div>
                <div className="relative" ref={statusRef}>
                    <button
                        onClick={() => setStatusOpen(prev => !prev)}
                        className="input 2xl:px-5 2xl:py-4 2xl:text-base 2xl:mb-1 w-full flex justify-between items-center"
                    >
                        {status || "Select Status"}
                        <img
                            src={DropdownIcon}
                            className={`w-5 2xl:w-6 transition-transform ${statusOpen ? "rotate-180" : ""}`}
                        />
                    </button>
                    {statusOpen && (
                        <div className="absolute top-11 2xl:top-15 z-50 w-full bg-white border rounded-lg shadow">
                            {statusOptions.map(item => (
                                <button
                                    key={item}
                                    onClick={() => { setStatus(item); setStatusOpen(false); }}
                                    className="block w-full px-4 py-2 2xl:px-5 2xl:py-3 text-left hover:bg-gray-100 rounded-lg"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Type</span>
                    <button onClick={() => setType("")} className="text-[#047EAF] text-sm">
                        Clear
                    </button>
                </div>
                <div className="relative" ref={typeRef}>
                    <button
                        onClick={() => setTypeOpen(prev => !prev)}
                        className="input 2xl:px-5 2xl:py-4 2xl:text-base 2xl:mb-1 w-full flex justify-between items-center"
                    >
                        {type || "Select Type"}
                        <img
                            src={DropdownIcon}
                            className={`w-5 2xl:w-6 transition-transform ${typeOpen ? "rotate-180" : ""}`}
                        />
                    </button>
                    {typeOpen && (
                        <div className="absolute top-11 2xl:top-15 w-full bg-white border rounded-lg shadow z-50">
                            {typeOptions.map(item => (
                                <button
                                    key={item}
                                    onClick={() => { setType(item); setTypeOpen(false); }}
                                    className="block w-full px-4 py-2 2xl:px-5 2xl:py-3 text-left hover:bg-gray-100 rounded-lg"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between text-sm 2xl:text-base text-gray-500 mb-2">
                    <span>Search by Keyword</span>
                    <button onClick={() => setKeyword("")} className="text-[#047EAF] text-sm 2xl:text-base">
                        Clear
                    </button>
                </div>
                <div className="relative">
                    <img src={SearchIcon} className="absolute left-4 top-3.5 2xl:top-4.5 w-4.5 2xl:w-5.5" />
                    <input
                        type="text"
                        value={keyword}
                        placeholder="e.g. blue backpack, black wallet"
                        onChange={(e) => setKeyword(e.target.value)}
                        className="input 2xl:px-5 2xl:py-4 2xl:text-base 2xl:mb-1 w-full pl-9 2xl:pl-11"
                    />
                </div>
            </div>

            <div className="flex justify-between">
                <button
                    onClick={handleClearAllLocal}
                    className="px-4 py-1 border rounded-lg text-[#646464]"
                >
                    Clear All
                </button>
                <button
                    onClick={handleApply}
                    className="px-5 py-1 bg-[#1980B2] text-white rounded-lg"
                >
                    Apply
                </button>
            </div>
        </div>
    );
}

export default FilterPopup;


