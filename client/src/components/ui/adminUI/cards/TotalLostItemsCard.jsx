import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TotalLostItemsIcon from "../../../../assets/icons/TotalLostItemsIcon.svg";

function TotalLostItemsCard() {
    const navigate = useNavigate();
    const [count, setCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        fetch("http://localhost:3000/api/admin/lost-items", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.items) setCount(data.items.length);
            })
            .catch(err => console.error("Failed to fetch lost items count:", err));
    }, []);

    return (
        <div
            onClick={() => navigate("/admin/items_management/lost")}
            className="cursor-pointer montserrat bg-white rounded-xl p-3 w-full h-45 flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] hover:z-10"
        >
            <div className="flex items-center justify-between">
                <div className="w-17 h-17 rounded-lg flex items-center justify-center bg-[#FFF6D4]">
                    <img src={TotalLostItemsIcon} alt="" className="w-10 h-10" />
                </div>
            </div>

            <div>
                <p className="text-sm text-[#646464] font-semibold mt-3">Total Lost Items</p>
                <p className="text-3xl font-semibold text-[#FFCC00]">{count}</p>
            </div>
        </div>
    );
}

export default TotalLostItemsCard;