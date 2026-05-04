import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import axios from "axios";

import LoadingScreen from "../../LoadingScreen";
import DLFSIcon from "../../../../assets/images/DLFSIcon.png";
import AdminLogInButton from "../../../../assets/images/AdminLogInButton.png";
import ExitIcon from "../../../../assets/icons/ExitIcon.svg";
import ShowPasswordIcon from "../../../../assets/icons/ShowPasswordIcon.svg";
import HidePasswordIcon from "../../../../assets/icons/HidePasswordIcon.svg";

function LoginPopup({ onClose }) {
    const navigate = useNavigate();
    const [showAdminForm, setShowAdminForm] = useState(false);
    const [adminId, setAdminId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const goToLoginPage = () => {
        onClose();
        navigate("/signin");
    };

    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:3000/api/admin/login", {
                id: adminId,
                password: password
            });

            const { token, admin } = response.data;

            localStorage.setItem('adminToken', token);
            localStorage.setItem('admin', JSON.stringify(admin));

            setLoading(false);
            setSuccess(true);

            setTimeout(() => {
                onClose();
                navigate("/admin/dashboard");
            }, 1500);

        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || "Login failed. Try again.");
        }
    };

    if (success) {
        return <LoadingScreen message="Logging in as Admin..." />;
    }

    return (
        <>
            {createPortal(
                <div
                    className="fixed inset-0 flex justify-center z-9999 bg-black/30"
                    onClick={onClose}
                >
                    <div
                        className="bg-white rounded-2xl w-105 h-fit mt-10 p-6 montserrat shadow-xl border border-gray-200 animate-scaleIn overflow-hidden transition-all duration-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-700 font-semibold">
                                {showAdminForm ? "Admin Log In" : "Log In"}
                            </p>
                            <button onClick={onClose} className="focus:outline-none focus:ring-0">
                                <img src={ExitIcon} alt="close" className="w-5 h-5" />
                            </button>
                        </div>

                        <div className={`transition-all duration-500 ease-in-out ${showAdminForm ? "max-h-0 opacity-0 mb-0" : "max-h-40 opacity-100"}`}>
                            <button
                                onClick={goToLoginPage}
                                className="w-full flex items-center justify-center gap-1 border border-[#646464] rounded-full py-1.5 mb-5 hover:scale-105 transition"
                            >
                                <img src={DLFSIcon} alt="icon" className="w-5 h-5" />
                                <span className="text-xs font-semibold text-gray-600">
                                    Log in to DLFS
                                </span>
                            </button>

                            <button
                                onClick={() => setShowAdminForm(true)}
                                className="w-full flex justify-center transition-transform duration-200 hover:scale-105"
                            >
                                <img src={AdminLogInButton} alt="Admin log in" className="w-full h-auto" />
                            </button>
                        </div>

                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showAdminForm ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                            <form onSubmit={handleAdminSubmit} className="flex flex-col">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-[#646464] font-medium">Admin ID</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your Admin ID"
                                        value={adminId}
                                        onChange={(e) => setAdminId(e.target.value)}
                                        className="input w-full"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-[#646464] font-medium">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="input w-full pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-6 -translate-y-1/2 focus:outline-none focus:ring-0 cursor-pointer"
                                        >
                                            <img
                                                src={showPassword ? HidePasswordIcon : ShowPasswordIcon}
                                                alt="Toggle Password"
                                                className="w-4.5 h-4.5"
                                            />
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-red-500 text-xs mt-1 mb-1">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="text-sm w-full bg-[#047EAF] text-white py-2 rounded-lg font-semibold focus:outline-none focus:ring-0 mt-2 mb-3 disabled:opacity-60"
                                >
                                    {loading ? "Checking..." : "Log in"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowAdminForm(false)}
                                    className="text-sm w-full bg-black text-white py-2 rounded-lg font-semibold focus:outline-none focus:ring-0"
                                >
                                    Back to SSO
                                </button>
                            </form>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default LoginPopup;