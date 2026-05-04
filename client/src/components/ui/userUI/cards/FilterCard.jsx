import React, { useState } from "react";

function FilterCard({ color, hovercolor, title, subtitle, icon, active, onClick }) {
  const [isHover, setIsHover] = useState(false);

  const bgColor = active ? "#FFFFFF" : isHover ? hovercolor : color;
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="montserrat flex items-center gap-3 p-2 rounded-xl cursor-pointer shrink-0 px-3 transition-all duration-200 "
      style={{
        backgroundColor: bgColor,
        width: "230px",
        minWidth: "200px",
      }}
    >
      <div className="w-7 h-7 rounded-lg flex items-center justify-center">
        <img src={icon} alt="" className="w-7 h-7" />
      </div>

      <div className="flex flex-col">
        <span className="text-xs font-semibold text-gray-800">{title}</span>
        <span className="text-[10px] text-gray-500">{subtitle}</span>
      </div>
    </div>
  );
}

export default FilterCard;