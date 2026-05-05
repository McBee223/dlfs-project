import { useState } from "react";
import { createPortal } from "react-dom";

import ExitIcon from "../../../../assets/icons/ExitIcon.svg";
import ShowPasswordIcon from "../../../../assets/icons/ShowPasswordIcon.svg";
import HidePasswordIcon from "../../../../assets/icons/HidePasswordIcon.svg";

function AdminLoginPopup({ onClose, onLogin }) {
    const [adminId, setAdminId] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onLogin) {
            onLogin({ adminId, password });
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center z-9999 bg-black/30"
            onClick={onClose}
        >
            <div
                className="bg-white w-90 rounded-2xl p-6 relative montserrat shadow-xl border border-gray-200 animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-semibold">Log in</h2>
                    <button onClick={onClose} className="focus:outline-none focus:ring-0">
                        <img src={ExitIcon} alt="Close" className="w-5.5 h-5.5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Admin ID"
                        value={adminId}
                        onChange={(e) => setAdminId(e.target.value)}
                        className="input"
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input w-full pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none focus:ring-0"
                        >
                            <img
                                src={showPassword ? HidePasswordIcon : ShowPasswordIcon}
                                alt="Toggle Password"
                                className="w-5 h-5"
                            />
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#047EAF] text-white py-2 rounded-lg mt-2 focus:outline-none focus:ring-0"
                    >
                        Log in
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
}

export default AdminLoginPopup;




