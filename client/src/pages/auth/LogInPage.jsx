import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignInImage from "../../assets/images/SignInImage.png";
import LoginLayout from "../../components/layout/userLayout/componentLayout/LoginLayout";
import RegisterLayout from "../../components/layout/userLayout/componentLayout/RegisterLayout";

function LogInPage() {
    const [isRegister, setIsRegister] = useState(false);
    const reason = new URLSearchParams(window.location.search).get("reason");
    const navigate = useNavigate();

    return (
        <div className="flex h-screen w-full montserrat bg-[#F9F9F9] overflow-hidden">
            <div className="hidden md:flex w-1/2 pt-8 flex-col">
                <div className="px-5 2xl:px-11">
                    <div className="flex items-start gap-3">
                        <button
                            onClick={() => navigate("/")}
                            className="mb-3 mt-3 text-gray-400 hover:text-gray-700 transition-colors"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 2xl:w-6 2xl:h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-lg 2xl:text-2xl font-semibold text-gray-800">
                                Lost Today, Found Tomorrow
                            </h2>
                            <p className="text-sm 2xl:text-lg text-gray-500">
                                Your shortcut to recovering what's missing. Simple, secure, and stress-free.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="-ml-50 2xl:-ml-80">
                    <img src={SignInImage} alt="preview" className="w-210 2xl:w-305" />
                </div>
            </div>

            <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6">
                {reason === "deleted" && (
                    <p className="absolute top-4 text-red-500 text-sm 2xl:text-lg font-medium">
                        Your account has been removed. Please contact support.
                    </p>
                )}
                {isRegister ? (
                    <RegisterLayout onSwitch={() => setIsRegister(false)} />
                ) : (
                    <LoginLayout onSwitch={() => setIsRegister(true)} />
                )}
            </div>
        </div>
    );
}

export default LogInPage;