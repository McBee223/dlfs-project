import { createContext, useContext, useState, useEffect, useCallback } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [seenIds, setSeenIds] = useState(new Set());

    const getToken = () => localStorage.getItem("userToken");

    const fetchNotifications = useCallback(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/user/notifications`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.notifications) setNotifications(data.notifications);
            })
            .catch((err) => console.error("Failed to fetch notifications:", err));
    }, []);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const deleteNotification = (id) => {
        fetch(`${import.meta.env.VITE_API_URL}/api/user/notifications/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(() => {
                setNotifications((prev) => prev.filter((n) => n.id !== id));
                setSeenIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
            })
            .catch((err) => console.error("Failed to delete:", err));
    };

    const deleteAllNotifications = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/user/notifications/delete-all`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(() => {
                setNotifications([]);
                setSeenIds(new Set());
            })
            .catch((err) => console.error("Failed to delete all:", err));
    };

    const markAsRead = (id) => {
        fetch(`${import.meta.env.VITE_API_URL}/api/user/notifications/${id}/read`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(() =>
                setNotifications((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, read: true } : n))
                )
            )
            .catch((err) => console.error("Failed to mark as read:", err));
    };

    const markAllAsRead = () => {
        fetch(`${import.meta.env.VITE_API_URL}/api/user/notifications/read-all`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${getToken()}` },
        })
            .then(() =>
                setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
            )
            .catch((err) => console.error("Failed to mark all:", err));
    };

    const markAllAsSeen = () => {
        setSeenIds(new Set(notifications.map((n) => n.id)));
    };

    const unreadCount = notifications.filter((n) => !n.read && !seenIds.has(n.id)).length;

    return (
        <NotificationContext.Provider
            value={{ notifications, deleteNotification, deleteAllNotifications, markAsRead, markAllAsRead, markAllAsSeen, unreadCount }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    return useContext(NotificationContext);
}