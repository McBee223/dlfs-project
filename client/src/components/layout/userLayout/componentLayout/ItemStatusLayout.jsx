import { useState } from "react";
import ItemStatusCard from "../../../ui/userUI/cards/ItemStatusCard";

function ItemStatusLayout({ items = [], editMode, selectedItems = [], toggleSelect, isTrash = false, onRestore }) {
    const [activeMenu, setActiveMenu] = useState(null);
    const safeItems = items.filter(i => i && i.status);

    return (
        <div className="montserrat w-full overflow-hidden bg-white overflow-y-auto h-110">
            <div className="grid grid-cols-[166px_147px_440px_150px_70px_130px] bg-[#E8F7FF] py-3 px-7 text-sm text-[#047EAF] font-semibold rounded-lg">
                <p>Item</p>
                <p>Type</p>
                <p>Message</p>
                <p>Date</p>
                <p>Status</p>
                <p></p>
            </div>
            <div>
                {safeItems.map((item) => (
                    <ItemStatusCard
                        key={item.id}
                        id={item.id}
                        item={item}
                        editMode={editMode}
                        selected={selectedItems.includes(item.id)}
                        toggleSelect={() => toggleSelect(item.id)}
                        activeMenu={activeMenu}
                        setActiveMenu={setActiveMenu}
                        isTrash={isTrash}
                        onRestore={onRestore}
                    />
                ))}
            </div>
        </div>
    );
}

export default ItemStatusLayout;