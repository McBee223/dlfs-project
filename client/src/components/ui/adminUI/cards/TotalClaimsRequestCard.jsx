import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TotalClaimsRequestIcon from "../../../../assets/icons/TotalClaimsRequestIcon.svg";

function TotalClaimsRequestCard() {
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);

    const fetchCount = () => {
        const token = localStorage.getItem('adminToken');
        console.log("token:", token);
        fetch('http://localhost:3000/api/admin/claims/count', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                console.log("claims count status:", res.status);
                return res.json();
            })
            .then(data => {
                console.log("claims count data:", data);
                if (data.count !== undefined) setTotal(data.count);
            })
            .catch(() => { });
    };

    useEffect(() => {
        fetchCount();
        const interval = setInterval(fetchCount, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            onClick={() => navigate("/admin/items_management/claims")}
            className="cursor-pointer montserrat bg-white rounded-xl p-3 w-full h-45 flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] hover:z-10"
        >
            <div className="flex items-center justify-between">
                <div className="w-17 h-17 rounded-lg flex items-center justify-center bg-[#E8F7FF]">
                    <img src={TotalClaimsRequestIcon} alt="" className="w-10 h-10" />
                </div>
            </div>

            <div>
                <p className="text-sm text-[#646464] font-semibold mt-3">Total Claims Request</p>
                <p className="text-3xl font-semibold text-[#047EAF]">{total}</p>
            </div>
        </div>
    );
}

export default TotalClaimsRequestCard;