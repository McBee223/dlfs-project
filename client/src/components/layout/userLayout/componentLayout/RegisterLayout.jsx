import { useState } from "react";
import axios from "axios";

import LoadingScreen from "../../../ui/LoadingScreen";
import HidePasswordIcon from '../../../../assets/icons/HidePasswordIcon.svg';
import ShowPasswordIcon from '../../../../assets/icons/ShowPasswordIcon.svg';
import RegisterGenderPopup from "../../../ui/userUI/popups/RegisterGenderPopup";

function RegisterLayout({ onSwitch, role, onBack }) {
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("Male");
    const [section, setSection] = useState("");
    const [department, setDepartment] = useState("");
    const [employeeId, setEmployeeId] = useState("");
    const [studentNumber, setStudentNumber] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState({ text: "", color: "" });
    const [animate, setAnimate] = useState("");
    const [loading, setLoading] = useState(false);

    const isStudent = role === "student";
    const isPersonnel = role === "school_personnel";
    const isStaff = role === "building_staff";

    const today = new Date();
    const date = `${String(today.getMonth() + 1).padStart(2, "0")}/${String(today.getDate()).padStart(2, "0")}/${String(today.getFullYear()).slice(-2)}`;

    const handleRegister = async () => {
        const baseValid = fullName && password && gender;
        const studentValid = isStudent && section && studentNumber && email;
        const personnelValid = isPersonnel && department && employeeId && email;
        const staffValid = isStaff && employeeId && email;

        if (!baseValid || (!studentValid && !personnelValid && !staffValid)) {
            setMessage({ text: "Please fill in all fields", color: "red" });
            return;
        }

        setLoading(true);
        setMessage({ text: "", color: "" });

        const payload = {
            name: fullName,
            password,
            gender,
            date,
            role,
            ...(isStudent && { id: studentNumber, microsoftaccount: email, section }),
            ...(isPersonnel && { id: employeeId, microsoftaccount: email, section: department }),
            ...(isStaff && { id: employeeId, microsoftaccount: email }),
        };

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/user/signup`, payload);

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

            <div className={`w-full max-w-md 2xl:max-w-2xl transition-all duration-800 ease-in-out ${animate === "fade-left" ? "opacity-0 -translate-x-10" : animate === "fade-right" ? "opacity-0 translate-x-10" : "opacity-100 translate-x-0"}`}>

                <button
                    onClick={onBack}
                    className="mb-4 2xl:mb-6 text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1 text-sm 2xl:text-base"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 2xl:w-5 2xl:h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Back
                </button>

                <h2 className="text-4xl 2xl:text-5xl font-semibold mb-2 2xl:mb-3">Create an account</h2>
                <p className="text-gray-500 mb-6 2xl:mb-7 text-sm 2xl:text-lg">Fill in the fields below to get started</p>

                <input
                    type="text"
                    placeholder="Full Name"
                    className="input 2xl:px-5 2xl:py-4 2xl:text-lg 2xl:mb-6"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="input 2xl:px-5 2xl:py-4 2xl:text-lg 2xl:mb-6"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-6 2xl:right-6 2xl:top-8 -translate-y-1/2 cursor-pointer"
                    >
                        <img
                            src={showPassword ? HidePasswordIcon : ShowPasswordIcon}
                            alt="toggle password"
                            className="w-4.5 h-4.5 2xl:w-5.5 2xl:h-5.5"
                        />
                    </span>
                </div>

                <div className="flex gap-2 2xl:gap-3">
                    {isStudent && (
                        <input
                            type="text"
                            placeholder="Section"
                            className="input w-105 2xl:w-157 2xl:px-5 2xl:py-4 2xl:text-lg 2xl:mb-6"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                        />
                    )}
                    {isPersonnel && (
                        <input
                            type="text"
                            placeholder="Department"
                            className="input w-105 2xl:w-157 2xl:px-5 2xl:py-4 2xl:text-lg 2xl:mb-6"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        />
                    )}
                    {(isStudent || isPersonnel) && (
                        <RegisterGenderPopup value={gender} onChange={setGender} />
                    )}
                </div>

                {isStaff && (
                    <RegisterGenderPopup value={gender} onChange={setGender} />
                )}

                {isStudent && (
                    <input
                        type="text"
                        placeholder="Student Number"
                        className="input 2xl:px-5 2xl:py-4 2xl:text-lg 2xl:mb-6"
                        value={studentNumber}
                        onChange={(e) => setStudentNumber(e.target.value)}
                    />
                )}

                {(isPersonnel || isStaff) && (
                    <input
                        type="text"
                        placeholder="Employee ID"
                        className="input 2xl:px-5 2xl:py-4 2xl:text-lg 2xl:mb-6"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                    />
                )}

                {(isStudent || isPersonnel) && (
                    <input
                        type="text"
                        placeholder="Microsoft 365 Account"
                        className="input 2xl:px-5 2xl:py-4 2xl:text-lg 2xl:mb-6"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                )}

                {isStaff && (
                    <input
                        type="text"
                        placeholder="Email"
                        className="input 2xl:px-5 2xl:py-4 2xl:text-lg 2xl:mb-6"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                )}

                {message.text && (
                    <p className={`text-sm 2xl:text-lg mb-2 2xl:mb-3 ${message.color === "red" ? "text-red-500" : "text-green-500"}`}>
                        {message.text}
                    </p>
                )}

                <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full bg-[#047EAF] 2xl:text-xl text-white py-3 2xl:py-5 rounded-lg hover:scale-105 transform transition-transform disabled:opacity-60"
                >
                    Sign up
                </button>

                <p className="text-sm 2xl:text-lg text-gray-500 mt-4 2xl:mt-5">
                    Already have an account?{" "}
                    <span
                        onClick={onSwitch}
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