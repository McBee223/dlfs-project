import { useState } from "react";
import StudentIcon from "../assets/icons/StudentIcon.svg";
import BuildingStaffIcon from "../assets/icons/BuildingStaffIcon.svg";
import SchoolPersonnelIcon from "../assets/icons/SchoolPersonnelIcon.svg";

const ROLES = [
    { key: "building_staff", label: "Building Staff", icon: BuildingStaffIcon },
    { key: "student", label: "Student", icon: StudentIcon },
    { key: "school_personnel", label: "School Personnel", icon: SchoolPersonnelIcon },
];

function RoleCarousel({ onSelect }) {
    const [current, setCurrent] = useState(1);

    const getPos = (idx) => {
        const diff = ((idx - current) % 3 + 3) % 3;
        if (diff === 0) return "center";
        if (diff === 1) return "right";
        return "left";
    };

    const shift = (dir) => setCurrent((prev) => ((prev + dir) % 3 + 3) % 3);

    const posStyles = {
        center: "z-30 scale-100 opacity-100 translate-x-0 w-48 h-60 2xl:w-72 2xl:h-88 shadow-lg",
        left:   "z-20 scale-90 opacity-60 -translate-x-56 2xl:-translate-x-80 w-36 h-44 2xl:w-56 2xl:h-68 shadow-md",
        right:  "z-20 scale-90 opacity-60 translate-x-56 2xl:translate-x-80 w-36 h-44 2xl:w-56 2xl:h-68 shadow-md",
    };

    const iconStyles = {
        center: "w-22 h-22 2xl:w-36 2xl:h-36",
        left:   "w-14 h-14 2xl:w-24 2xl:h-24",
        right:  "w-14 h-14 2xl:w-24 2xl:h-24",
    };

    const labelStyles = {
        center: "text-sm 2xl:text-xl font-semibold text-gray-800",
        left:   "text-xs 2xl:text-base font-medium text-gray-400",
        right:  "text-xs 2xl:text-base font-medium text-gray-400",
    };

    return (
        <div className="flex flex-col items-center justify-center gap-6 2xl:gap-10 w-full">
            <div className="flex flex-col items-center gap-1 2xl:gap-2">
                <h1 className="text-xl 2xl:text-3xl font-semibold text-gray-800">Welcome! Please select your role.</h1>
                <p className="text-sm 2xl:text-base text-gray-400 text-center">Choose the role that best represents you to get started.</p>
            </div>

            <div className="relative flex items-center justify-center h-64 2xl:h-96 w-full">
                {ROLES.map((role, idx) => {
                    const pos = getPos(idx);
                    return (
                        <div
                            key={role.key}
                            onClick={() => pos === "center" ? onSelect(ROLES[current].key) : shift(pos === "left" ? -1 : 1)}
                            className={`absolute flex flex-col items-center justify-center gap-3 2xl:gap-6
                                bg-white rounded-3xl border border-gray-100 cursor-pointer
                                transition-all duration-300 ease-in-out
                                ${posStyles[pos]}`}
                        >
                            <img
                                src={role.icon}
                                alt={role.label}
                                className={`object-contain transition-all duration-300 ${iconStyles[pos]}`}
                            />
                            <span className={`transition-all duration-300 ${labelStyles[pos]}`}>
                                {role.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col items-center gap-2 2xl:gap-4">
                <p className="text-xs 2xl:text-sm text-gray-400">Click a side card to switch · Click center to continue</p>
                <button
                    onClick={() => onSelect(ROLES[current].key)}
                    className="px-7 py-2 2xl:px-10 2xl:py-3 bg-[#047EAF] text-white text-sm 2xl:text-lg font-semibold rounded-xl hover:bg-[#035f85] transition-colors"
                >
                    Continue as {ROLES[current].label}
                </button>
            </div>
        </div>
    );
}

export default RoleCarousel;