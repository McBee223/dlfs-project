import { useNavigate } from "react-router-dom";

const iconColors = {
    "Claim Submitted": "#378ADD",
    "Claim Approved": "#1D9E75",
    "Claim Rejected": "#E24B4A",
    "Claim Cancelled": "#BA7517",
    "Schedule Submitted": "#378ADD",
    "Upcoming Pickup Reminder": "#BA7517",
    "Missed Schedule": "#E24B4A",
    "Item Returned Successfully": "#1D9E75",
};

const NotifIcon = ({ title, color }) => {
    const svgProps = {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "2",
        className: "w-[18px] h-[18px] 2xl:w-[20px] 2xl:h-[20px]"
    };

    if (title === "Claim Rejected" || title === "Claim Cancelled") {
        return (
            <svg {...svgProps}>
                <circle cx="12" cy="12" r="9" />
                {title === "Claim Rejected"
                    ? <><path d="M15 9l-6 6M9 9l6 6" /></>
                    : <path d="M12 8v4m0 4h.01" />
                }
            </svg>
        );
    }
    if (title === "Schedule Submitted") {
        return (
            <svg {...svgProps}>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
        );
    }
    if (title === "Upcoming Pickup Reminder" || title === "Missed Schedule") {
        return (
            <svg {...svgProps}>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
            </svg>
        );
    }
    return (
        <svg {...svgProps}>
            <path d="M9 12l2 2 4-4" />
            <path d="M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z" />
        </svg>
    );
};

function NotificationItem({ notification, onDelete, onRead }) {
    const navigate = useNavigate();
    const { id, title, text, time, read } = notification;
    const color = iconColors[title] || "#378ADD";

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
                style={{ backgroundColor: `${color}22` }}
            >
                <NotifIcon title={title} color={color} />
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[13px] 2xl:text-[15px] text-gray-800">{title}</h3>
                <p className="text-[10px] 2xl:text-[12px] text-gray-400 mb-1">
                    {time}{!read && <span className="ml-2 text-[#185FA5] font-medium">• New</span>}
                </p>
                <p className="text-[11px] 2xl:text-[13px] text-gray-500 leading-relaxed">{text}</p>

                <div className="overflow-hidden transition-all duration-200 ease-in-out max-h-0 opacity-0 group-hover:max-h-8 group-hover:opacity-100">
                    <button
                        onClick={handleDelete}
                        className="mt-2 text-[11px] 2xl:text-[13px] px-3 py-1 rounded bg-[#047EAF] text-white hover:bg-[#035d82] transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {!read && (
                <div className="w-2 h-2 2xl:w-3 2xl:h-3 rounded-full bg-[#378ADD] shrink-0 mt-1.5" />
            )}
        </div>
    );
}

export default NotificationItem;



