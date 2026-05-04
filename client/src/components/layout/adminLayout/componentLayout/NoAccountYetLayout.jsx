import NoItemFoundIcon from "../../../../assets/icons/NoItemFoundIcon.svg";

function NoUserAccountYetLayout({ onClear, info }) {
    return (
        <div className="flex-1 flex items-center justify-center min-h-100">
            <div className="flex flex-col items-center text-center">

                <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-[#E8F7FF] mb-4">
                    <img src={NoItemFoundIcon} alt="" className="w-7 h-7" />
                </div>

                <p className="montserrat text-[#646464] text-sm font-semibold mb-1">
                    {`No ${info} yet`}
                </p>

                <p className="montserrat text-[#969696] text-xs max-w-70 mb-4">
                    {`There are currently no ${info} in this list at the moment. New ${info} will appear here.`}
                </p>

            </div>
        </div>
    );
}

export default NoUserAccountYetLayout;