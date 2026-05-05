import FilterCard from "../../../ui/userUI/cards/FilterCard";
import AllFilterIcon from "../../../../assets/icons/AllFilterIcon.svg";
import PersonalFilterIcon from "../../../../assets/icons/PersonalFilterIcon.svg";
import ElectronicFilterIcon from "../../../../assets/icons/ElectronicFilterIcon.svg";
import DocumentFilterIcon from "../../../../assets/icons/DocumentFilterIcon.svg";
import ClothingFilterIcon from "../../../../assets/icons/ClothingFilterIcon.svg";
import SchoolItemFilterIcon from "../../../../assets/icons/SchooItemFilterIcon.svg";
import BagFilterIcon from "../../../../assets/icons/BagFilterIcon.svg";

const filters = [
    { icon: AllFilterIcon, color: "#D4FFFB", hovercolor: "#B9FFF9", title: "All Items", subtitle: "Show all lost items in the list", categoryKey: "All" },
    { icon: PersonalFilterIcon, color: "#D0EDFB", hovercolor: "#AFE5FF", title: "Personal", subtitle: "Wallet / Keys / Eyeglasses / ID", categoryKey: "Personal" },
    { icon: DocumentFilterIcon, color: "#DAFADB", hovercolor: "#BAFFBD", title: "Document", subtitle: "School ID / Driver's License", categoryKey: "Document" },
    { icon: ClothingFilterIcon, color: "#EFD4FF", hovercolor: "#E1AEFF", title: "Clothing", subtitle: "Jacket/Sweater/Towel/Cap", categoryKey: "Clothes" },
    { icon: ElectronicFilterIcon, color: "#FFF6D4", hovercolor: "#FFEEAA", title: "Electronic", subtitle: "Phone/Watch/Tablet/Laptop", categoryKey: "Electronics" },
    { icon: SchoolItemFilterIcon, color: "#FFE3D4", hovercolor: "#FFC9AC", title: "School Items", subtitle: "Ballpen/Notebook/Calculator", categoryKey: "School Item" },
    { icon: BagFilterIcon, color: "#FADADA", hovercolor: "#FFAEAF", title: "Bag", subtitle: "Backpack/Handbag/Tote bag", categoryKey: "Bags" },
];

function FilterLayout({ scrollRef, activeCategory, onCategoryChange }) {
    return (
        <div
            ref={scrollRef}
            className="flex gap-3 my-5 overflow-x-auto scrollbar-none w-full max-w-240 2xl:max-w-340"
        >
            {filters.map((item, index) => (
                <FilterCard
                    key={index}
                    hovercolor={item.hovercolor}
                    color={item.color}
                    title={item.title}
                    subtitle={item.subtitle}
                    icon={item.icon}
                    active={activeCategory === item.categoryKey}
                    onClick={() => onCategoryChange(item.categoryKey)}
                />
            ))}
        </div>
    );
}

export default FilterLayout;




