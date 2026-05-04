import { useRef, useState } from "react";
import DashboardButtonLeft from '../../../../assets/images/DashboardButtonLeft.png';
import DashboardButtonRight from '../../../../assets/images/DashboardButtonRight.png';
import DashboardButtonLeftActive from '../../../../assets/images/DashboardButtonLeftActive.png';
import DashboardButtonRightActive from '../../../../assets/images/DashboardButtonRightActive.png';
import PinnedCardLayout from "./PinnedCardLayout";

function PinnedNavigateLayout({ pinnedItems, scrollRef, onUnpin, onClaim, onEditClaim }) {
    const [active, setActive] = useState(null);

    const scrollLeft = () => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
        setActive("left");
    };

    const scrollRight = () => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        setActive("right");
    };

    return (
        <div className="w-full max-w-240 my-5">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold montserrat text-[#323232]">
                    Pinned Items
                </h2>
                <div className="flex gap-2">
                    <button onClick={scrollLeft} className="w-8 h-8 flex items-center justify-center">
                        <img src={active === "left" ? DashboardButtonLeftActive : DashboardButtonLeft} alt="" />
                    </button>
                    <button onClick={scrollRight} className="w-8 h-8 flex items-center justify-center">
                        <img src={active === "right" ? DashboardButtonRightActive : DashboardButtonRight} alt="" />
                    </button>
                </div>
            </div>

            <PinnedCardLayout
                pinnedItems={pinnedItems}
                scrollRef={scrollRef}
                onUnpin={onUnpin}
                onClaim={onClaim}
                onEditClaim={onEditClaim}
            />
        </div>
    );
}

export default PinnedNavigateLayout;