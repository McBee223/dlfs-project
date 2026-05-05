import TotalItemsCard from "../../../ui/userUI/cards/TotalItemsCard";
import PinnedItemsCard from "../../../ui/userUI/cards/RightBarPinnedItemsCard";
import CalendarCard from "../../../ui/userUI/cards/CalendarCard ";
import ELMSButtonCard from "../../../ui/userUI/cards/ELMSButtonCard ";

function RightBar({ pinnedCount, claimedCount }) {
    return (
        <div className="min-h-screen w-60 2xl:w-70 transition-all duration-200 mx-2 mr-6 2xl:mr-7">
            <div className="flex flex-1 min-h-0 h-full">
                <div className="flex-1">
                    <TotalItemsCard total={claimedCount} />
                    <PinnedItemsCard pinnedCount={pinnedCount} />
                    <CalendarCard />
                    <ELMSButtonCard />
                </div>
            </div>
        </div>
    );
}

export default RightBar;




