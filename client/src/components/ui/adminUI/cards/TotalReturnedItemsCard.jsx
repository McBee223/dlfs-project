import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TotalReturnedItemsIcon from "../../../../assets/icons/TotalReturnedItemsIcon.svg";

function TotalReturnedItemsCard() {
    const navigate = useNavigate();
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchCount = () => {
            const token = localStorage.getItem("adminToken");
            fetch("http://localhost:3000/api/admin/returned-items", {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.items) setCount(data.items.length);
                })
                .catch(err => console.error("Failed to fetch returned items count:", err));
        };

        fetchCount();
        const interval = setInterval(fetchCount, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            onClick={() => navigate("/admin/items_management/returned")}
            className="cursor-pointer montserrat bg-white rounded-xl p-3 w-full h-45 flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] hover:z-10"
        >
            <div className="flex items-center justify-between">
                <div className="w-17 h-17 rounded-lg flex items-center justify-center bg-[#FFE8E8]">
                    <img src={TotalReturnedItemsIcon} alt="" className="w-10 h-10" />
                </div>
            </div>

            <div>
                <p className="text-sm text-[#646464] font-semibold mt-3">Total Returned Items</p>
                <p className="text-3xl font-semibold text-[#AF2C04]">{count}</p>
            </div>
        </div>
    );
}

export default TotalReturnedItemsCard;