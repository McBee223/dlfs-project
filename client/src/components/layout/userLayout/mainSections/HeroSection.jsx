import { useEffect, useState } from "react";

import LoginPopup from "../../../ui/userUI/popups/LoginPopup";
import LoadingPopup from "../../../ui/userUI/popups/LoadingPopup";

import HeroBackground from "../../../../assets/images/HeroBackground.png";
import PhoneImage from "../../../../assets/images/PhoneImage.png";

import FindMyItemButton from '../../../../assets/images/FindMyItemButton.png'
import FindMyItemButtonHover from '../../../../assets/images/FindMyItemButtonHover.png'

function HeroSection() {
    const [showLoader, setShowLoader] = useState(true);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const [showBottom, setShowBottom] = useState(true);

    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const loaderTimer = setTimeout(() => {
            setShowLoader(false);
            setShowLoginPopup(true);
        }, 700); 

        return () => clearTimeout(loaderTimer);
    }, []);


    useEffect(() => {
        const handleScroll = () => {
            setShowBottom(window.scrollY < 100);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className="relative w-full h-screen flex items-center overflow-hidden bg-white">

            <img
                src={HeroBackground}
                alt=""
                className="absolute right-0 -bottom-40 w-220 max-w-none"
            />

            <img
                src={PhoneImage}
                alt=""
                className="absolute right-6 -bottom-62 w-150 max-w-none z-10"
            />

            <div className="relative z-20 w-full max-w-7xl mx-20 px-12 grid grid-cols-2 items-center">

                <div>
                    <h1 className="montserrat text-5xl font-bold text-[#323232] leading-tight">
                        DLFS: Find it <br />
                        faster, claim it <br />
                        smarter
                    </h1>

                    <p className="montserrat text-md text-[#646464] font-semibold my-3 max-w-md">
                        DLFS streamlines the lost-and-found process by providing a
                        faster and more efficient way to claim lost items through
                        a digital platform.
                    </p>

                    <button
                        className="my-1"
                        onClick={() => setShowLoginPopup(true)}
                    >
                        <img
                            src={isHovered ? FindMyItemButtonHover : FindMyItemButton}
                            alt="example"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className={`w-35 cursor-pointer transition-transform duration-300 ${isHovered ? "scale-110" : "scale-100"
                                }`}
                        />
                    </button>
                </div>

            </div>

            <div
                className={`absolute bottom-0 left-0 w-full transition-all duration-500 z-100
                bg-linear-to-t from-white via-white/70 to-transparent
                ${showBottom ? "h-28 opacity-100" : "h-0 opacity-0"}`}
            />

            {showLoader && <LoadingPopup />}

            {showLoginPopup && (
                <LoginPopup onClose={() => setShowLoginPopup(false)} />
            )}

        </section>
    );
}

export default HeroSection;