import NoItemFoundIcon from "../../../../assets/icons/NoItemFoundIcon.svg";

function NoItemsYetLayout() {

    return (
        <div className="flex-1 flex items-center justify-center min-h-100 2xl:min-h-200">
            <div className="flex flex-col items-center text-center">

                <div className="w-16 h-16 2xl:w-18 2xl:h-18 flex items-center justify-center rounded-xl bg-[#E8F7FF] mb-4">
                    <img src={NoItemFoundIcon} alt="" className="w-7 h-7 2xl:w-9 2xl:h-9" />
                </div>

                <p className="montserrat text-[#646464] text-sm 2xl:text-lg font-semibold mb-1">
                    No items yet
                </p>

                <p className="montserrat text-[#969696] text-xs 2xl:text-base max-w-70 mb-4">
                    There are currently no items in this list at the moment. New items will appear here
                </p>

            </div>
        </div>
    )
}

export default NoItemsYetLayout;

