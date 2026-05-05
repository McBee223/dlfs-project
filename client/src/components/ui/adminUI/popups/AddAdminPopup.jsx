import { useState, useRef, useEffect } from "react";
import ExitIcon from '../../../../assets/icons/ExitIcon.svg';
import ShowPasswordIcon from '../../../../assets/icons/ShowPasswordIcon.svg';
import HidePasswordIcon from '../../../../assets/icons/HidePasswordIcon.svg';

function AddAdminPopup({ onClose, onConfirm }) {
    const modalRef = useRef();
    const token = localStorage.getItem('adminToken');

    const [adminId, setAdminId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [microsoftAccount, setMicrosoftAccount] = useState("");
    const [userLevel] = useState("Admin");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const today = new Date();
    const date = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}/${String(today.getFullYear()).slice(-2)}`;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const handleSubmit = async () => {
        if (!adminId || !firstName || !lastName || !password || !microsoftAccount) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError("");

        const fullName = `${firstName} ${lastName}`.trim();

        try {
            const res = await fetch('${import.meta.env.VITE_API_URL}/api/admin/admins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: adminId,
                    name: fullName,
                    password,
                    microsoftaccount: microsoftAccount,
                    date,
                    role: 'Admin'
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to add admin");
                return;
            }

            onConfirm({ id: adminId, name: fullName, password, microsoftaccount: microsoftAccount, date, role: 'Admin' });

        } catch (err) {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div ref={modalRef} className="montserrat bg-white w-155 2xl:w-180 max-h-[85vh] rounded-2xl shadow-lg p-6 2xl:p-8 flex flex-col">
                <div className="flex justify-between items-center mb-4 2xl:mb-6">
                    <h2 className="text-lg 2xl:text-xl font-semibold text-[#323232]">Add Admin</h2>
                    <button onClick={onClose}>
                        <img src={ExitIcon} className="w-5 h-5 2xl:w-6 2xl:h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-3 2xl:pr-4">
                    <div>
                        <label className="text-sm 2xl:text-base text-[#646464] font-medium block mb-1 2xl:mb-2">Admin ID</label>
                        <input type="text" value={adminId} onChange={(e) => setAdminId(e.target.value)} className="input 2xl:text-base w-full placeholder-gray-400" placeholder="0001" />
                    </div>

                    <div className="flex gap-2 2xl:gap-3">
                        <div className="flex-1">
                            <label className="text-sm 2xl:text-base text-[#646464] font-medium block mb-1 2xl:mb-2">First Name</label>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input 2xl:text-base w-full placeholder-gray-400" placeholder="Juan" />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm 2xl:text-base text-[#646464] font-medium block mb-1 2xl:mb-2">Last Name</label>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="input 2xl:text-base w-full placeholder-gray-400" placeholder="Dela Cruz" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm 2xl:text-base text-[#646464] font-medium block mb-1 2xl:mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input 2xl:text-base w-full pr-10 placeholder-gray-400"
                                placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 2xl:right-5 top-6 -translate-y-1/2 cursor-pointer">
                                <img src={showPassword ? HidePasswordIcon : ShowPasswordIcon} className="w-4 h-4 2xl:w-5 2xl:h-5 opacity-80" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm 2xl:text-base text-[#646464] font-medium block mb-1 2xl:mb-2">Microsoft Account</label>
                        <input type="text" value={microsoftAccount} onChange={(e) => setMicrosoftAccount(e.target.value)} className="input 2xl:text-base w-full placeholder-gray-400" placeholder="account44563@stamaria.sti.edu.ph" />
                    </div>

                    <div>
                        <label className="text-sm 2xl:text-base text-[#646464] font-medium block mb-1 2xl:mb-2">User Level</label>
                        <input type="text" value={userLevel} disabled className="input 2xl:text-base w-full text-[#969696] placeholder-gray-400" />
                    </div>

                    {error && <p className="text-red-500 text-xs 2xl:text-sm mt-2">{error}</p>}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="mt-4 2xl:mt-6 bg-[#047EAF] text-white py-3 2xl:py-4 rounded-xl 2xl:text-base font-semibold disabled:opacity-60"
                >
                    {loading ? "Adding..." : "Add Admin"}
                </button>
            </div>
        </div>
    );
}

export default AddAdminPopup;


