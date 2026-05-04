function SortByPopup({ setSortLabel, setShowSort }) {
    const handleSelect = (value) => {
        setSortLabel(value);
        setShowSort(false);
    };

    return (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md p-2 z-10">
            
            <button
                onClick={() => handleSelect("All Time")}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-[#047EAF]"
            >
                All Time
            </button>

            <button
                onClick={() => handleSelect("This Week")}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
            >
                This Week
            </button>

            <button
                onClick={() => handleSelect("This Month")}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
            >
                This Month
            </button>

            <button
                onClick={() => handleSelect("This Year")}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
            >
                This Year
            </button>
        </div>
    );
}

export default SortByPopup;