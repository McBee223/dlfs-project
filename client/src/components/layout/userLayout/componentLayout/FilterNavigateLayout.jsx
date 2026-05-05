import FilterLayout from "./FilterLayout";
import { useRef, useState } from "react";
import DashboardButtonLeft from '../../../../assets/images/DashboardButtonLeft.png';
import DashboardButtonRight from '../../../../assets/images/DashboardButtonRight.png';
import DashboardButtonLeftActive from '../../../../assets/images/DashboardButtonLeftActive.png';
import DashboardButtonRightActive from '../../../../assets/images/DashboardButtonRightActive.png';

function FilterNavigateLayout({ activeCategory, onCategoryChange }) {
    const scrollRef = useRef(null);
    const [active, setActive] = useState(null);

    const scrollLeft = () => {
        scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
        setActive("left");
    };

    const scrollRight = () => {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        setActive("right");
    };

    return (
        <div className="w-full max-w-240 2xl:max-w-337 my-5">
            <div className="flex items-center justify-between">
                <h2 className="text-xl 2xl:text-2xl font-semibold montserrat text-[#323232]">
                    Lost Item
                </h2>
                <div className="flex gap-2">
                    <button onClick={scrollLeft} className="w-8 h-8 2xl:w-9 2xl:h-9 flex items-center justify-center rounded-full">
                        <img src={active === "left" ? DashboardButtonLeftActive : DashboardButtonLeft} alt="" />
                    </button>
                    <button onClick={scrollRight} className="w-8 h-8 2xl:w-9 2xl:h-9 flex items-center justify-center rounded-full">
                        <img src={active === "right" ? DashboardButtonRightActive : DashboardButtonRight} alt="" />
                    </button>
                </div>
            </div>

            <FilterLayout
                scrollRef={scrollRef}
                activeCategory={activeCategory}
                onCategoryChange={onCategoryChange}
            />
        </div>
    );
}

export default FilterNavigateLayout;



