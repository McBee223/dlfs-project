import { useState } from "react";
import axios from "axios";

import LoadingScreen from "../../../ui/LoadingScreen";
import HidePasswordIcon from '../../../../assets/icons/HidePasswordIcon.svg';
import ShowPasswordIcon from '../../../../assets/icons/ShowPasswordIcon.svg';
import RegisterGenderPopup from "../../../ui/userUI/popups/RegisterGenderPopup";

function RegisterLayout({ onSwitch }) {
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [section, setSection] = useState("");
    const [gender, setGender] = useState("Male");
    const [password, setPassword] = useState("");
    const [studentNumber, setStudentNumber] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState({ text: "", color: "" });
    const [animate, setAnimate] = useState("");
    const [loading, setLoading] = useState(false);

    const today = new Date();
    const date = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}/${String(today.getFullYear()).slice(-2)}`;

    const handleRegister = async () => {
        if (!firstName || !lastName || !section || !password || !studentNumber || !email) {
            setMessage({ text: "Please fill in all fields", color: "red" });
            return;
        }

        setLoading(true);
        setMessage({ text: "", color: "" });

        const fullName = `${firstName} ${lastName}`;

        try {
            await axios.post("http://localhost:3000/api/user/signup", {
                id: studentNumber,
                name: fullName,
                microsoftaccount: email,
                section,
                gender,
                password,
                date
            });

            setLoading(false);
            setMessage({ text: "Registered successfully!", color: "green" });

            setTimeout(() => {
                setAnimate("fade-left");
                setTimeout(() => {
                    setAnimate("fade-right");
                    setTimeout(() => {
                        onSwitch();
                        setMessage({ text: "", color: "" });
                        setAnimate("");
                    }, 500);
                }, 800);
            }, 1000);

        } catch (err) {
            setLoading(false);
            setMessage({ text: err.response?.data?.message || "Registration failed. Try again.", color: "red" });
        }
    };

    return (
        <>
            {loading && <LoadingScreen message="Creating account..." />}

            <div className={`w-full max-w-md transition-all duration-800 ease-in-out ${animate === "fade-left" ? "opacity-0 -translate-x-10" : animate === "fade-right" ? "opacity-0 translate-x-10" : "opacity-100 translate-x-0"}`}>
                <h2 className="text-3xl font-semibold mb-2">Create an account</h2>
                <p className="text-gray-500 mb-6 text-sm">Fill in the fields below to get started</p>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="First Name"
                        className="input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Section"
                        className="input"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                    />
                    <RegisterGenderPopup value={gender} onChange={setGender} />
                </div>

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

                <input
                    type="text"
                    placeholder="Student Number"
                    className="input"
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Microsoft 365 Account"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {message.text && (
                    <p className={`text-sm mb-2 ${message.color === "red" ? "text-red-500" : "text-green-500"}`}>
                        {message.text}
                    </p>
                )}

                <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full bg-[#047EAF] text-white py-3 rounded-lg hover:scale-105 transform transition-transform disabled:opacity-60"
                >
                    Sign up
                </button>

                <p className="text-sm text-gray-500 mt-4">
                    Already have an account?{" "}
                    <span
                        onClick={() => {
                            setAnimate("fade-left");
                            setTimeout(() => onSwitch(), 500);
                        }}
                        className="text-blue-600 cursor-pointer"
                    >
                        Log in
                    </span>
                </p>
            </div>
        </>
    );
}

export default RegisterLayout;