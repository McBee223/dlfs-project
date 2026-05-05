import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

import UserDropdown from "../../../ui/userUI/popups/UserDropdown";
import LogoutPopup from "../../../ui/userUI/popups/LogoutPopup";

import Logo from "../../../../assets/images/LOGO.svg";

import DashboardIcon from "../../../../assets/icons/Dashboard.svg";
import DashboardActiveIcon from "../../../../assets/icons/DashboardActive.svg";
import ItemsIcon from "../../../../assets/icons/items.svg";
import ItemsActiveIcon from "../../../../assets/icons/itemsActive.svg";
import AccountIcon from "../../../../assets/icons/Account.svg";
import AccountActiveIcon from "../../../../assets/icons/AccountActive.svg";

import LogOutIcon from "../../../../assets/icons/Log-Out.svg";
import LogOutActiveIcon from "../../../../assets/icons/Log-OutActive.svg";

function Sidebar() {
  const [show, setShow] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const location = useLocation();

  const isRouteActive = (basePath) => location.pathname.startsWith(basePath);

  return (
    <>
      <div className="bg-[#132A3F] text-white flex flex-col w-45 2xl:w-50 h-screen rounded-tr-2xl rounded-br-2xl fixed">

        <div className="flex justify-center p-7">
          <img src={Logo} alt="Logo" />
        </div>

        <div className="pl-8 mt-5 pb-2 text-[10px] 2xl:text-[12px] montserrat text-[#D0EDFB]">
          OVERVIEW
        </div>

        <nav className="flex flex-col h-full pl-4 text-sm 2xl:text-base">

          <div className="flex flex-col gap-2">

            <div
              onMouseEnter={() => setShow(true)}
              onMouseLeave={() => setShow(false)}
              className="relative"
            >
              <SidebarItem
                to="/user/dashboard"
                icon={DashboardIcon}
                activeIcon={DashboardActiveIcon}
                label="Dashboard"
                forceActive={isRouteActive("/user/dashboard")}
                isDropdownOpen={show}
              />
              {show && <UserDropdown />}
            </div>

            <SidebarItem
              to="/user/items"
              icon={ItemsIcon}
              activeIcon={ItemsActiveIcon}
              label="Items"
              forceActive={isRouteActive("/user/items")}
            />

            <SidebarItem
              to="/user/profile"
              icon={AccountIcon}
              activeIcon={AccountActiveIcon}
              label="Account"
              forceActive={isRouteActive("/user/profile")}
            />

          </div>

          <div className="mt-auto mb-4 2xl:mb-6">
            <div onClick={() => setLogoutOpen(true)}>
              <SidebarItem
                to="#"
                icon={LogOutIcon}
                activeIcon={LogOutActiveIcon}
                label="Log Out"
              />
            </div>
          </div>

        </nav>
      </div>

      {logoutOpen && (
        <LogoutPopup
          onClose={() => setLogoutOpen(false)}
          onConfirm={() => setLogoutOpen(false)}
        />
      )}
    </>
  );
}

function SidebarItem({
  to,
  icon,
  activeIcon,
  iconSize = "w-5 h-5 2xl:w-6 2xl:h-6",
  label,
  isDropdownOpen,
  forceActive = false,
  hideActiveStyle = false,
  nested = false,
  onMouseEnter,
  onMouseLeave,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NavLink
      to={to}
      onMouseEnter={(e) => {
        setIsHovered(true);
        onMouseEnter && onMouseEnter(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        onMouseLeave && onMouseLeave(e);
      }}
      className={({ isActive }) => {
        const active = forceActive || isActive;

        if (active && !isHovered && !isDropdownOpen && !hideActiveStyle && !nested) {
          return "relative flex items-center gap-3 px-4 py-3 rounded-l-lg transition-all duration-300 text-[#D0EDFB]";
        }

        if (isHovered || isDropdownOpen) {
          return "relative flex items-center gap-3 px-4 py-3 rounded-l-lg transition-all duration-300 bg-white text-black";
        }

        return "relative flex items-center gap-3 px-4 py-3 rounded-l-lg transition-all duration-300 text-white";
      }}
    >
      {({ isActive }) => (
        <>
          {!nested && forceActive && !isHovered && !isDropdownOpen && !hideActiveStyle && (
            <span className="absolute -left-4 top-2 h-6 2xl:h-8 w-1 2xl:w-1.3 bg-[#D0EDFB] rounded-r"></span>
          )}

          {nested && (
            <span className="absolute -left-2 top-2 h-6 w-1 bg-gray-400 rounded-r"></span>
          )}

          {icon && (
            <img
              src={(forceActive || isActive || isHovered || isDropdownOpen) && activeIcon ? activeIcon : icon}
              alt={label}
              className={`${iconSize} transition-all duration-200`}
            />
          )}

          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default Sidebar;




