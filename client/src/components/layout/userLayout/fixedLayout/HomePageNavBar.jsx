import { useState } from "react";

import LOGO from '../../../../assets/images/LOGO.svg';
import LogInButton from '../../../../assets/images/LogInButton.png';
import LogInButtonHover from '../../../../assets/images/LogInButtonHover.png';

import LoginPopup from "../../../ui/userUI/popups/LoginPopup";

function HomePageNavBar() {
    const [isHover, setIsHover] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center">
            <div className="w-[90%] max-w-500 2xl:max-w-9xl mt-3 px-6 2xl:px-10 py-2 2xl:py-3 flex items-center justify-between backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl shadow-lg shadow-black/10">

                <img
                    src={LOGO}
                    alt="logo"
                    className="w-27 2xl:w-36 h-auto cursor-pointer"
                    onClick={() => scrollToSection("home")}
                />

                <div className="flex gap-15 2xl:gap-25 text-base 2xl:text-xl font-semibold text-[#646464]">
                    <button onClick={() => scrollToSection("home")} className="relative p-3 2xl:p-4 group">
                        Home
                        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#047EAF] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                    </button>
                    <button onClick={() => scrollToSection("about")} className="relative p-3 2xl:p-4 group">
                        About us
                        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#047EAF] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                    </button>
                    <button onClick={() => scrollToSection("features")} className="relative p-3 2xl:p-4 group">
                        Features
                        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#047EAF] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                    </button>
                </div>

                <button
                    onClick={() => setShowLoginPopup(true)}
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    className="transition-transform duration-200"
                >
                    <img
                        src={isHover ? LogInButtonHover : LogInButton}
                        alt="Log In"
                        className={`p-1 w-25 2xl:w-32 h-auto transition-transform duration-200 ${isHover ? "scale-105" : "scale-100"}`}
                    />
                </button>

                {showLoginPopup && (
                    <LoginPopup onClose={() => setShowLoginPopup(false)} />
                )}

            </div>
        </div>
    );
}

export default HomePageNavBar;



