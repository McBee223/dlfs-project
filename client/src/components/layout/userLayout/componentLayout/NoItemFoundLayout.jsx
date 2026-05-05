import NoItemFoundIcon from "../../../../assets/icons/NoItemFoundIcon.svg";

function NoItemFoundLayout({ onClear }) {
    return (
        <div className="flex-1 flex items-center justify-center min-h-100 2xl:min-h-200">
            <div className="flex flex-col items-center text-center">

                <div className="w-16 h-16 2xl:w-18 2xl:h-18 flex items-center justify-center rounded-xl bg-[#E8F7FF] mb-4">
                    <img src={NoItemFoundIcon} alt="" className="w-7 h-7 2xl:w-9 2xl:h-9" />
                </div>

                <p className="montserrat text-[#646464] text-sm 2xl:text-lg font-semibold mb-1">
                    No items found
                </p>

                <p className="montserrat text-[#969696] text-xs 2xl:text-base max-w-70 mb-4">
                    No items match your search. Please try using a different keyword or refine your search terms.
                </p>

                <button
                    onClick={onClear}
                    className="montserrat px-4 py-1 border border-[#D8D8D8] text-[#969696] text-xs 2xl:text-base rounded-lg"
                >
                    Clear Search
                </button>

            </div>
        </div>
    );
}

export default NoItemFoundLayout;




