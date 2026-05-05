import { useState } from "react";

function RegisterGenderPopup({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const options = ["Male", "Female"];

  return (
    <div className="relative w-full">
      <div
        className="input 2xl:px-5 2xl:py-4 2xl:text-lg 2xl:mb-6 cursor-pointer flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        <span>{value}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {open && (
        <div className="absolute z-10 -mt-3 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          {options.map((opt) => (
            <div
              key={opt}
              className="px-4 py-2 hover:bg-[#69ADCE] hover:text-white rounded-sm cursor-pointer text-sm 2xl:text-lg"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RegisterGenderPopup;




