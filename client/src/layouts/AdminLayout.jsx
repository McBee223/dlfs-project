import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/adminLayout/fixedLayout/Sidebar";
import { ProfileProvider } from "../context/ProfileContext";
import { AdminNotificationProvider } from "../context/AdminNotificationContext";

function AdminLayout() {
  return (
    <ProfileProvider role="admin">
      <AdminNotificationProvider>
        <div className="flex min-h-screen overflow-x-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 ml-45 2xl:ml-50">
            <Outlet />
          </div>
        </div>
      </AdminNotificationProvider>
    </ProfileProvider>
  );
}

export default AdminLayout;



