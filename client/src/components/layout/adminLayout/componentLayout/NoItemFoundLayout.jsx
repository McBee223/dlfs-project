import NoItemFoundIcon from "../../../../assets/icons/NoItemFoundIcon.svg";

function NoItemFoundLayout({ onClear }) {
    return (
        <div className="flex-1 flex items-center justify-center min-h-100">
            <div className="flex flex-col items-center text-center">

                <div className="w-16 h-16 2xl:w-20 2xl:h-20 flex items-center justify-center rounded-xl bg-[#E8F7FF] mb-4 2xl:mb-5">
                    <img src={NoItemFoundIcon} alt="" className="w-7 h-7 2xl:w-9 2xl:h-9" />
                </div>

                <p className="montserrat text-[#646464] text-sm 2xl:text-base font-semibold mb-1 2xl:mb-2">
                    No items found
                </p>

                <p className="montserrat text-[#969696] text-xs 2xl:text-sm max-w-70 2xl:max-w-80 mb-4 2xl:mb-5">
                    No items match your search. Please try using a different keyword or refine your search terms.
                </p>

                <button
                    onClick={onClear}
                    className="montserrat px-4 py-1 2xl:px-5 2xl:py-1.5 border border-[#D8D8D8] text-[#969696] text-xs 2xl:text-sm rounded-lg"
                >
                    Clear Search
                </button>

            </div>
        </div>
    );
}

export default NoItemFoundLayout;




