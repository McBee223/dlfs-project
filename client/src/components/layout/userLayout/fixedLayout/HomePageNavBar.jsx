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
            <div className="w-[90%] max-w-290 mt-3 px-6 py-2 flex items-center justify-between backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl shadow-lg shadow-black/10">

                <img
                    src={LOGO}
                    alt="logo"
                    className="w-27 h-auto cursor-pointer"
                    onClick={() => scrollToSection("home")}
                />

                <div className="flex gap-15 text-md font-semibold text-[#646464]">
                    <button onClick={() => scrollToSection("home")} className="relative p-3 group">
                        Home
                        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#047EAF] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                    </button>
                    <button onClick={() => scrollToSection("about")} className="relative p-3 group">
                        About us
                        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#047EAF] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                    </button>
                    <button onClick={() => scrollToSection("features")} className="relative p-3 group">
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
                        className={`p-1 w-25 h-auto transition-transform duration-200 ${isHover ? "scale-105" : "scale-100"}`}
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