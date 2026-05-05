import { NavLink, useLocation } from "react-router-dom";
import { useState, useRef } from "react";

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
  const [showItemsDropdown, setShowItemsDropdown] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const timeoutRef = useRef(null);
  const location = useLocation();

  const isRouteActive = (basePath) => location.pathname.startsWith(basePath);

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    setShowItemsDropdown(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowItemsDropdown(false);
    }, 150);
  };

  return (
    <>
      <div className="bg-[#132A3F] text-white flex flex-col w-45 2xl:w-50 h-screen rounded-tr-2xl rounded-br-2xl fixed">

        <div className="flex justify-center p-7">
          <img src={Logo} alt="Logo" />
        </div>

        <div className="pl-8 mt-5 pb-2 text-[10px] 2xl:text-[12px] montserrat text-[#D0EDFB]">
          OVERVIEW
        </div>

        <nav className="flex flex-col h-full pl-2 text-xs 2xl:text-sm">

          <div className="flex flex-col gap-1">

            <SidebarItem
              to="/admin/dashboard"
              icon={DashboardIcon}
              activeIcon={DashboardActiveIcon}
              label="Dashboard"
              forceActive={isRouteActive("/admin/dashboard")}
            />

            <div
              className="relative"
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              <SidebarItem
                to="/admin/items_management/lost"
                icon={ItemsIcon}
                activeIcon={ItemsActiveIcon}
                label="Items Management"
                forceActive={isRouteActive("/admin/items_management")}
                isDropdownOpen={showItemsDropdown}
              />

              <div
                className={`ml-6 mt-1 border-l border-[#2E4A63] pl-4 flex flex-col gap-1 overflow-hidden transition-all duration-300 ease-in-out
                ${showItemsDropdown ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}`}
              >
                <SidebarItem to="/admin/items_management/lost" label="Lost Items" nested />
                <SidebarItem to="/admin/items_management/claims" label="Claim Request" nested />
                <SidebarItem to="/admin/items_management/approved" label="Approved Items" nested />
                <SidebarItem to="/admin/items_management/rejected" label="Rejected Items" nested />
                <SidebarItem to="/admin/items_management/returned" label="Returned Items" nested />
                <SidebarItem to="/admin/items_management/trash" label="Trash" nested />
              </div>
            </div>

            <SidebarItem
              to="/admin/profile"
              icon={AccountIcon}
              activeIcon={AccountActiveIcon}
              label="Account"
              forceActive={isRouteActive("/admin/profile")}
            />

          </div>

          <div className="mt-auto mb-4 2xl:mb-6">
            <div onClick={() => setLogoutOpen(true)}>
              <SidebarItem
                to="#"
                icon={LogOutIcon}
                activeIcon={LogOutActiveIcon}
                label="Log out"
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
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NavLink
      to={to}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={({ isActive }) => {
        const active = forceActive || isActive;

        if (nested) {
          return "flex items-center px-2 py-2 rounded-l-lg rounded-r-none transition text-[#D0EDFB] hover:bg-white hover:text-black 2xl:text-sm";
        }

        if (active && !isHovered && !isDropdownOpen && !hideActiveStyle) {
          return "relative flex items-center gap-3 px-4 py-3 rounded-l-lg text-[#D0EDFB]";
        }

        if (isHovered || isDropdownOpen) {
          return "relative flex items-center gap-3 px-4 py-3 rounded-l-lg bg-white text-black";
        }

        return "relative flex items-center gap-3 px-4 py-3 rounded-l-lg text-white";
      }}
    >
      {({ isActive }) => (
        <>
          {!nested && forceActive && (
            <span className="absolute -left-2 top-2.5 h-6 2xl:h-8 w-1 2xl:w-1.3 bg-[#D0EDFB] rounded-r"></span>
          )}

          {icon && !nested && (
            <img
              src={(forceActive || isActive || isHovered || isDropdownOpen) && activeIcon ? activeIcon : icon}
              alt={label}
              className={iconSize}
            />
          )}

          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default Sidebar;

