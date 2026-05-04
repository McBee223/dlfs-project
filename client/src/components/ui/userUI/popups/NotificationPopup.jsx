import { useNotifications } from "../../../../context/NotificationContext";
import NotificationItem from "../../userUI/components/NotificationItem";

function NotificationPopup() {
    const { notifications, deleteNotification, markAsRead, markAllAsRead, deleteAllNotifications } = useNotifications();

    return (
        <div className="absolute top-11 -right-40 w-130 bg-white rounded-2xl shadow-xl z-50 flex flex-col h-80 pb-5">
            <div className="mb-4 border-b border-gray-100 py-3">
                <div className="px-5 flex justify-between items-center">
                    <h2 className="montserrat font-semibold text-md">Notifications</h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={markAllAsRead}
                            className="text-sm text-gray-500 hover:text-black transition-colors"
                        >
                            Mark all as read
                        </button>
                        {notifications.length > 0 && (
                            <button
                                onClick={deleteAllNotifications}
                                className="text-sm text-red-400 hover:text-red-600 transition-colors"
                            >
                                Delete all
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-sm text-gray-400">
                        No notifications
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onDelete={deleteNotification}
                            onRead={markAsRead}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default NotificationPopup;