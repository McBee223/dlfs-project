import { useEffect, useRef, useState } from "react";
import ExitIcon from '../../../../assets/icons/ExitIcon.svg'
import ClaimItemPopup from "./ClaimItemPopup";

function ViewItemPopup({ item, onClose }) {

    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!item) return null;

    return (
        <>
            <div className="fixed inset-0 bg-[rgba(100,100,100,0.37)] flex items-center justify-center z-50">

                <div
                    ref={modalRef}
                    className="flex flex-col bg-white w-120 h-140 2xl:w-140 2xl:h-160 rounded-2xl shadow-lg p-5"
                >

                    <div className="flex justify-between items-center">
                        <p className="montserrat text-lg 2xl:text-xl font-semibold">Items Details</p>
                        <button onClick={onClose}>
                            <img src={ExitIcon} alt="" className="w-7 2xl:w-9 h-auto" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 mt-3">

                        <p className="montserrat text-sm 2xl:text-base my-2 font-semibold">
                            Image
                        </p>

                        <div className="w-full h-60 2xl:h-80 rounded-xl overflow-hidden bg-gray-200 mb-5">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>

                        <p className="montserrat text-sm 2xl:text-base mb-1 font-semibold">
                            Item Name
                        </p>
                        <div className="montserrat input 2xl:px-5 2xl:py-4 2xl:text-base 2xl:mb-1">{item.name}</div>

                        <p className="montserrat text-sm 2xl:text-base mb-1 font-semibold">
                            Category
                        </p>
                        <div className="montserrat input 2xl:px-5 2xl:py-4 2xl:text-base 2xl:mb-1">{item.category}</div>

                        <p className="montserrat text-sm 2xl:text-base mb-1 font-semibold">
                            Date & Time
                        </p>
                        <div className="montserrat input 2xl:px-5 2xl:py-4 2xl:text-base 2xl:mb-1">{item.date_found}</div>

                        <p className="montserrat text-sm 2xl:text-base mb-1 font-semibold">
                            Last Seen
                        </p>
                        <div className="montserrat input 2xl:px-5 2xl:py-4 2xl:text-base 2xl:mb-1">{item.last_seen}</div>
                    </div>

                </div>

            </div>


        </>
    );
}

export default ViewItemPopup;




