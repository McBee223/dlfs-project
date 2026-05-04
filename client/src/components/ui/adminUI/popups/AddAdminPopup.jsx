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
            const res = await fetch('http://localhost:3000/api/admin/admins', {
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
            <div ref={modalRef} className="montserrat bg-white w-155 max-h-[85vh] rounded-2xl shadow-lg p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-[#323232]">Add Admin</h2>
                    <button onClick={onClose}>
                        <img src={ExitIcon} className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-3">
                    <div>
                        <label className="text-sm text-[#646464] font-medium block mb-1">Admin ID</label>
                        <input type="text" value={adminId} onChange={(e) => setAdminId(e.target.value)} className="input w-full" placeholder="0001" />
                    </div>

                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="text-sm text-[#646464] font-medium block mb-1">First Name</label>
                            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input w-full" placeholder="Crisjei" />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm text-[#646464] font-medium block mb-1">Last Name</label>
                            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="input w-full" placeholder="Quinal" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-[#646464] font-medium block mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input w-full pr-10"
                                placeholder="••••••••"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-6 -translate-y-1/2 cursor-pointer">
                                <img src={showPassword ? HidePasswordIcon : ShowPasswordIcon} className="w-4 h-4 opacity-80" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-[#646464] font-medium block mb-1">Microsoft Account</label>
                        <input type="text" value={microsoftAccount} onChange={(e) => setMicrosoftAccount(e.target.value)} className="input w-full" placeholder="account44563@stamaria.sti.edu.ph" />
                    </div>

                    <div>
                        <label className="text-sm text-[#646464] font-medium block mb-1">User Level</label>
                        <input type="text" value={userLevel} disabled className="input w-full text-[#969696]" />
                    </div>

                    {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="mt-4 bg-[#047EAF] text-white py-3 rounded-xl font-semibold disabled:opacity-60"
                >
                    {loading ? "Adding..." : "Add Admin"}
                </button>
            </div>
        </div>
    );
}

export default AddAdminPopup;