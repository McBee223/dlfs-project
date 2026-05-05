import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/userLayout/fixedLayout/Sidebar";
import { ProfileProvider } from "../context/ProfileContext";
import { NotificationProvider } from "../context/NotificationContext";

function UserLayout() {
  return (
    <ProfileProvider role="user">
      <NotificationProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex flex-col flex-1 ml-45 2xl:ml-50">
            <Outlet />
          </div>
        </div>
      </NotificationProvider>
    </ProfileProvider>
  );
}

export default UserLayout;



