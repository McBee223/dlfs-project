import React, { useState } from "react";

function FilterCard({ color, hovercolor, title, subtitle, icon, active, onClick }) {
  const [isHover, setIsHover] = useState(false);

  const bgColor = active ? "#FFFFFF" : isHover ? hovercolor : color;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="montserrat flex items-center gap-3 p-2 2xl:p-3 rounded-xl cursor-pointer shrink-0 px-3 2xl:px-4 transition-all duration-200 w-57.5 2xl:w-67.5 min-w-50"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-7 h-7 2xl:w-8 2xl:h-8 rounded-lg flex items-center justify-center">
        <img src={icon} alt="" className="w-7 h-7 2xl:w-8 2xl:h-8" />
      </div>

      <div className="flex flex-col">
        <span className="text-xs 2xl:text-base font-semibold text-gray-800">{title}</span>
        <span className="text-[10px] 2xl:text-[12px] text-gray-500">{subtitle}</span>
      </div>
    </div>
  );
}

export default FilterCard;