import { useNavigate } from "react-router-dom";

const notifConfig = {
    "Claim Submitted": {
        color: "#2563EB",
        bg: "#EFF6FF",
        icon: (color) => (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-4.5 h-4.5 2xl:w-5 2xl:h-5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
        ),
    },
    "Claim Approved": {
        color: "#059669",
        bg: "#ECFDF5",
        icon: (color) => (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-4.5 h-4.5 2xl:w-5 2xl:h-5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
    },
    "Claim Rejected": {
        color: "#DC2626",
        bg: "#FEF2F2",
        icon: (color) => (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-4.5 h-4.5 2xl:w-5 2xl:h-5">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
        ),
    },
    "Claim Cancelled": {
        color: "#D97706",
        bg: "#FFFBEB",
        icon: (color) => (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-4.5 h-4.5 2xl:w-5 2xl:h-5">
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
        ),
    },
    "Schedule Submitted": {
        color: "#7C3AED",
        bg: "#F5F3FF",
        icon: (color) => (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-4.5 h-4.5 2xl:w-5 2xl:h-5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
            </svg>
        ),
    },
    "Upcoming Pickup Reminder": {
        color: "#0891B2",
        bg: "#ECFEFF",
        icon: (color) => (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-4.5 h-4.5 2xl:w-5 2xl:h-5">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
        ),
    },
    "Missed Schedule": {
        color: "#DB2777",
        bg: "#FDF2F8",
        icon: (color) => (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-4.5 h-4.5 2xl:w-5 2xl:h-5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
        ),
    },
    "Item Returned Successfully": {
        color: "#16A34A",
        bg: "#F0FDF4",
        icon: (color) => (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-4.5 h-4.5 2xl:w-5 2xl:h-5">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
                <polyline points="9 11 12 14 22 4" />
            </svg>
        ),
    },
    "New User Logged In": {
        color: "#0284C7",
        bg: "#F0F9FF",
        icon: (color) => (
            <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-4.5 h-4.5 2xl:w-5 2xl:h-5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
                <polyline points="16 11 18 13 22 9" />
            </svg>
        ),
    },
};

const fallbackConfig = {
    color: "#6B7280",
    bg: "#F9FAFB",
    icon: (color) => (
        <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="w-4.5 h-4.5 2xl:w-5 2xl:h-5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    ),
};

function AdminNotificationItem({ notification, onDelete, onRead }) {
    const navigate = useNavigate();
    const { id, title, text, time, read } = notification;

    const matchedKey = Object.keys(notifConfig).find((key) => title?.includes(key));
    const config = matchedKey ? notifConfig[matchedKey] : fallbackConfig;
    const { color, bg, icon } = config;

    const handleClick = () => {
        onRead(id);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(id);
    };

    return (
        <div
            className="montserrat group flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
            onClick={handleClick}
        >
            <div
                className="w-10 h-10 2xl:w-11 2xl:h-11 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: bg }}
            >
                {icon(color)}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[13px] 2xl:text-[15px] text-gray-800">{title}</h3>
                <p className="text-[10px] 2xl:text-[12px] text-gray-400 mb-1">
                    {time}
                    {!read && (
                        <span className="ml-2 font-semibold" style={{ color }}>
                            • New
                        </span>
                    )}
                </p>
                <p className="text-[11px] 2xl:text-[13px] text-gray-500 leading-relaxed">{text}</p>

                <div className="overflow-hidden transition-all duration-200 ease-in-out max-h-0 opacity-0 group-hover:max-h-8 group-hover:opacity-100">
                    <button
                        onClick={handleDelete}
                        className="mt-2 text-[11px] 2xl:text-[13px] px-3 py-1 rounded text-white transition-colors"
                        style={{ backgroundColor: color }}
                    >
                        Delete
                    </button>
                </div>
            </div>

            {!read && (
                <div
                    className="w-2 h-2 2xl:w-3 2xl:h-3 rounded-full shrink-0 mt-1.5"
                    style={{ backgroundColor: color }}
                />
            )}
        </div>
    );
}

export default AdminNotificationItem;


