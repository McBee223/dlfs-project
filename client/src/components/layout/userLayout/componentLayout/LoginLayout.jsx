import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import LoadingScreen from "../../../ui/LoadingScreen";
import HidePasswordIcon from '../../../../assets/icons/HidePasswordIcon.svg';
import ShowPasswordIcon from '../../../../assets/icons/ShowPasswordIcon.svg';

function LoginLayout({ onSwitch }) {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [microsoftaccount, setMicrosoftaccount] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState({ text: "", color: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleLogin = async () => {
        if (!microsoftaccount || !password) {
            setMessage({ text: "Please fill in all fields", color: "red" });
            return;
        }

        setLoading(true);
        setMessage({ text: "", color: "" });

        try {
            const response = await axios.post("http://localhost:3000/api/user/login", {
                microsoftaccount,
                password
            });

            const { token, user } = response.data;

            localStorage.setItem('userToken', token);
            localStorage.setItem('user', JSON.stringify(user));

            setLoading(false);
            setSuccess(true);

            setTimeout(() => {
                navigate("/user/dashboard");
            }, 1500);

        } catch (err) {
            setLoading(false);
            setMessage({ text: err.response?.data?.message || "Login failed. Try again.", color: "red" });
        }
    };

    return (
        <>
            {success && <LoadingScreen message="Logging in..." />}

            <div className="w-full max-w-md">
                <h2 className="text-3xl font-semibold mb-2">Welcome to DFLS</h2>
                <p className="text-gray-500 mb-6 text-sm">
                    Please log in to your account to continue.
                </p>

                <input
                    type="text"
                    placeholder="Microsoft 365 Account"
                    className="input mb-3"
                    value={microsoftaccount}
                    onChange={(e) => setMicrosoftaccount(e.target.value)}
                />

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-6 -translate-y-1/2 cursor-pointer"
                    >
                        <img
                            src={showPassword ? HidePasswordIcon : ShowPasswordIcon}
                            alt="toggle password"
                            className="w-4.5 h-4.5"
                        />
                    </span>
                </div>

                {message.text && (
                    <p className={`text-sm mb-2 ${message.color === "red" ? "text-red-500" : "text-green-500"}`}>
                        {message.text}
                    </p>
                )}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-[#047EAF] text-white py-3 rounded-lg hover:scale-105 transform transition-transform disabled:opacity-60"
                >
                    {loading ? "Checking..." : "Log in"}
                </button>

                <p className="text-sm text-gray-500 mt-4">
                    Don't have an account?{" "}
                    <span onClick={onSwitch} className="text-blue-600 cursor-pointer">
                        Register
                    </span>
                </p>
            </div>
        </>
    );
}

export default LoginLayout;