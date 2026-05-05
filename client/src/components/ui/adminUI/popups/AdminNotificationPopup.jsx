import { useAdminNotifications } from "../../../../context/AdminNotificationContext";
import AdminNotificationItem from "../../../ui/adminUI/components/AdminNotificationItem";

function AdminNotificationPopUp() {
    const { notifications, deleteNotification, markAsRead, markAllAsRead, deleteAllNotifications } = useAdminNotifications();

    return (
        <div className="montserrat absolute top-12 -right-18 w-130 2xl:w-150 bg-white rounded-2xl shadow-xl z-50 flex flex-col h-80 2xl:h-100 pb-5 2xl:pb-6">
            <div className="mb-4 border-b-2 border-[rgba(155,154,154,0.2)] py-3">
                <div className="px-5 flex justify-between items-center">
                    <h2 className="montserrat font-semibold text-md 2xl:text-lg">Notifications</h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={markAllAsRead}
                            className="text-sm 2xl:text-base text-gray-500 hover:text-black transition-colors"
                        >
                            Mark all as read
                        </button>
                        {notifications.length > 0 && (
                            <button
                                onClick={deleteAllNotifications}
                                className="text-sm 2xl:text-base text-red-400 hover:text-red-600 transition-colors"
                            >
                                Delete all
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="montserrat flex items-center justify-center h-full text-sm 2xl:text-base text-gray-400">
                        No notifications
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <AdminNotificationItem
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

export default AdminNotificationPopUp;



