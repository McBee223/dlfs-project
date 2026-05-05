import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState, useEffect, useRef } from "react";

import CalendarIcon from "../../../../assets/icons/CalendarIcon.svg"
    
function CalendarCard() {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [popupDate, setPopupDate] = useState(null);
    const [popupItems, setPopupItems] = useState([]);
    const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
    const popupRef = useRef();

    useEffect(() => {
        const token = localStorage.getItem("userToken");

        const fetchEvents = () => {
            fetch(`${import.meta.env.VITE_API_URL}/api/user/calendar-events`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(r => r.json())
                .then(d => setEvents(d.events || []))
                .catch(err => console.error("Failed to fetch calendar events:", err));
        };

        fetchEvents();

        const interval = setInterval(fetchEvents, 2000);

        return () => clearInterval(interval);
    }, []);

    const eventMap = {};
    events.forEach(ev => {
        if (!ev.pickup_date) return;
        const date = new Date(ev.pickup_date);

        const key =
            date.getFullYear() +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(date.getDate()).padStart(2, "0");
        if (!eventMap[key]) eventMap[key] = [];
        eventMap[key].push(ev);
    });

    const formatKey = (d) => {
        return (
            d.getFullYear() +
            "-" +
            String(d.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(d.getDate()).padStart(2, "0")
        );
    };

    const handleDayClick = (value, e) => {
        const key = formatKey(value);
        const items = eventMap[key];
        if (!items || items.length === 0) { setPopupDate(null); return; }
        const rect = e.target.closest(".react-calendar__tile").getBoundingClientRect();
        setPopupPos({ top: rect.bottom + window.scrollY + 8, left: rect.left + window.scrollX - 100 });
        setPopupDate(key);
        setPopupItems(items);
        setVisible(true);
    };

    useEffect(() => {
        const handler = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) setPopupDate(null);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const tileContent = ({ date: tileDate, view }) => {
        if (view !== "month") return null;
        const key = formatKey(tileDate);
        const count = eventMap[key]?.length || 0;
        if (!count) return null;
        return (
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#00658D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.8rem",
                zIndex: 5,
                pointerEvents: "none",
            }}>
                {count > 9 ? "9+" : tileDate.getDate()}
                <span style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    background: "#e02020",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 16,
                    height: 16,
                    fontSize: "0.55rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.18)"
                }}>
                    {count}
                </span>
            </div>
        );
    };

    const tileClassName = ({ date: tileDate, view }) => {
        if (view !== "month") return null;
        const key = formatKey(tileDate);
        return eventMap[key]?.length ? "has-event" : null;
    };

    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => setVisible(false);
        window.addEventListener("scroll", handleScroll, true);
        return () => window.removeEventListener("scroll", handleScroll, true);
    }, []);

    return (
        <>
            <style>{`
                .has-event {
                    position: relative;
                    color: transparent !important;
                    overflow: visible !important;
                }
                .has-event abbr {
                    visibility: hidden;
                }
                .react-calendar__tile--now.has-event {
                    background: transparent !important;
                }
            `}</style>

            <div className="bg-white rounded-xl p-4 w-60 2xl:w-70">
                <Calendar
                    onChange={setDate}
                    value={date}
                    className="custom-calendar"
                    tileContent={tileContent}
                    tileClassName={tileClassName}
                    onClickDay={handleDayClick}
                />
            </div>

            {popupDate && (
                <div
                    ref={popupRef}
                    style={{
                        position: "absolute",
                        top: popupPos.top,
                        right: 100,
                        zIndex: 1000,
                        fontFamily: "'Montserrat', sans-serif"
                    }}
                    className={`montserrat bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-106 2xl:w-130 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                    onTransitionEnd={() => { if (!visible) onClose(); }}
                >
                    <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="flex gap-2 text-sm 2xl:text-base font-bold text-[#1a1a1a] mb-4">
                        <img src={CalendarIcon} className="2xl:w-5 2xl:h-5" /> {new Date(popupDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                    <table className="w-full text-xs" style={{ fontFamily: "'Montserrat', sans-serif", borderCollapse: "separate", borderSpacing: "0" }}>
                        <thead>
                            <tr style={{ background: "#f5f5f5" }}>
                                <th className="py-2 px-3 text-left font-semibold text-gray-500 2xl:text-base rounded-l-lg">Item</th>
                                <th className="py-2 px-3 text-left font-semibold text-gray-500 2xl:text-base">Category</th>
                                <th className="py-2 px-3 text-left font-semibold text-gray-500 2xl:text-base rounded-r-lg">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {popupItems.map((item, i) => (
                                <tr key={i} style={{ borderBottom: i < popupItems.length - 1 ? "1px solid #f0f0f0" : "none" }}>
                                    <td className="py-3 px-3 2xl:text-base font-semibold text-[#1a1a1a]">{item.item_name}</td>
                                    <td className="py-3 px-3 2xl:text-base text-[#646464]">{item.category || "-"}</td>
                                    <td className="py-3 px-3 2xl:text-base font-semibold text-[#00658D] whitespace-nowrap">{item.pickup_time || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default CalendarCard;



