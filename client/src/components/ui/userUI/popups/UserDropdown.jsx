import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import PersonalDropdownIcon from "../../../../assets/icons/PersonalDropdownIcon.svg";
import DocumentDropdownIcon from "../../../../assets/icons/DocumentDropdownIcon.svg";
import ClothesDropdownIcon from "../../../../assets/icons/ClothesDropdownIcon.svg";
import ElectronicDropdownIcon from "../../../../assets/icons/ElectronicDropdownIcon.svg";
import SchoolItemDropdownIcon from "../../../../assets/icons/SchoolItemDropdownIcon.svg";
import BagDropdownIcon from "../../../../assets/icons/BagDropdownIcon.svg";

const categories = [
  { icon: PersonalDropdownIcon, label: "Personal", key: "Personal" },
  { icon: DocumentDropdownIcon, label: "Document", key: "Document" },
  { icon: ClothesDropdownIcon, label: "Clothing", key: "Clothes" },
  { icon: ElectronicDropdownIcon, label: "Electronics", key: "Electronics" },
  { icon: SchoolItemDropdownIcon, label: "School Item", key: "School Item" },
  { icon: BagDropdownIcon, label: "Bag", key: "Bags" },
];

function UserDropdown({ onMouseEnter, onMouseLeave }) {
  const navigate = useNavigate();

  const handleClick = (categoryKey) => {
    navigate("/user/dashboard", { state: { category: categoryKey } });
  };

  return createPortal(
    <div
      className="fixed top-30 left-45 z-9999 bg-white py-1 px-1 rounded-xl w-80 shadow-lg"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <nav className="text-[#000000] montserrat text-[11px]">
        <ul className="p-1">
          {categories.map(({ icon, label, key }) => (
            <li
              key={key}
              onClick={() => handleClick(key)}
              className="flex items-center gap-2 pl-5 py-3 pr-4 hover:bg-[#EAEAEA] hover:rounded-sm font-medium cursor-pointer text-[13px]"
            >
              <img src={icon} className="w-4 h-4" />
              {label}
            </li>
          ))}
        </ul>
      </nav>
    </div>,
    document.body
  );
}

export default UserDropdown;