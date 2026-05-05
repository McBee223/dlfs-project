import { useState, useRef, useEffect } from "react";
import DropdownIcon from '../../../../assets/icons/DropdownIcon.svg';
import GenderIcon from '../../../../assets/icons/GenderIcon.svg';

function GenderPopup({ disabled, value, onChange }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const options = ["Male", "Female"];

    const handleSelect = (option) => {
        if (disabled) return;
        onChange(option); 
        setOpen(false);
    };

    const toggleDropdown = () => {
        if (disabled) return;
        setOpen(!open);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="montserrat" ref={dropdownRef}>
            <label className="text-sm 2xl:text-base font-semibold text-gray-500 mb-1 block">Gender</label>

            <div className="flex flex-col w-full">
                <div className={`flex items-center rounded-lg px-3 2xl:px-5 py-2.5 2xl:py-3.5 border
                    ${disabled ? "border-gray-300 bg-white cursor-default" : "border-gray-300 bg-gray-100"}
                    focus-within:border-gray-400`}>
                    <img src={GenderIcon} className="w-5 h-5 2xl:w-5.5 2xl:h-5.5 mr-2" />
                    <button
                        type="button"
                        onClick={toggleDropdown}
                        className="flex-1 flex items-center justify-between bg-transparent focus:outline-none"
                    >
                        <span className="text-gray-500">{value}</span> {/* 👈 use prop */}
                        {!disabled && (
                            <img src={DropdownIcon} alt="Dropdown arrow"
                                className={`w-5 h-5 2xl:w-5.5 2xl:h-5.5 ml-2 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                        )}
                    </button>
                </div>

                {open && !disabled && (
                    <div className="mt-2 w-full bg-white border border-gray-200 rounded-lg shadow">
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleSelect(option)}
                                className="block w-full text-left text-sm 2xl:text-base  pl-10 py-2 hover:bg-[#F9F9F9] focus:outline-none"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GenderPopup;



