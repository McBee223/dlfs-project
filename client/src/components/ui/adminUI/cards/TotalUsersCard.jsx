import { useState, useEffect } from "react";
import TotalUsersIcon from "../../../../assets/icons/TotalUsersIcon.svg";

function TotalUsersCard({ count }) {
    const [totalUsers, setTotalUsers] = useState(0);
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        console.log("token:", token);
        fetch('http://localhost:3000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                console.log("users status:", res.status);
                return res.json();
            })
            .then(data => {
                console.log("users data:", data);
                if (data.users) setTotalUsers(data.users.length);
            });
    }, []);

    useEffect(() => {
        if (count !== null && count !== undefined) setTotalUsers(count);
    }, [count]);

    const handleClick = () => {
        document.getElementById("accounts-section")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    };

    return (
        <div
            onClick={handleClick}
            className="cursor-pointer montserrat bg-white rounded-xl p-3 2xl:p-5 w-full h-45 2xl:h-56 flex flex-col justify-between transform transition duration-300 hover:scale-[1.02] hover:z-10">
            <div className="flex items-center justify-between">
                <div className="w-17 h-17 2xl:w-20 2xl:h-20 rounded-lg flex items-center justify-center bg-[#E8FFE9]">
                    <img src={TotalUsersIcon} alt="" className="w-10 h-10 2xl:w-12 2xl:h-12" />
                </div>
            </div>
            <div>
                <p className="text-sm 2xl:text-base text-[#646464] font-semibold mt-3">Total Users</p>
                <p className="text-3xl 2xl:text-4xl font-semibold text-[#04AF0A]">{totalUsers}</p>
            </div>
        </div>
    );
}

export default TotalUsersCard;