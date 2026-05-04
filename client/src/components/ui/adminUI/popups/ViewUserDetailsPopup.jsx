import { useState, useRef, useEffect } from "react";
import ExitIcon from "../../../../assets/icons/ExitIcon.svg";
import EditButton from "../buttons/EditButton";
import SaveButton from "../buttons/SaveButton";
import ShowPasswordIcon from "../../../../assets/icons/ShowPasswordIcon.svg";
import HidePasswordIcon from "../../../../assets/icons/HidePasswordIcon.svg";

function ViewUserDetailsPopup({ onClose, user, onUpdate, readOnly = false }) {
    const [showPassword, setShowPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || "");
    const [section, setSection] = useState(user?.section || "");
    const [gender, setGender] = useState(user?.gender || "");
    const [password, setPassword] = useState(user?.password || "");
    const [studentNumber, setStudentNumber] = useState(user?.id || "");
    const [microsoftaccount, setMicrosoftAccount] = useState(user?.microsoftaccount || "");
    const [userLevel] = useState(user?.role || "User");

    const modalRef = useRef();
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const handleSave = () => {
        fetch(`http://localhost:3000/api/admin/users/${user?.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ id: studentNumber, name, section, gender, password, microsoftaccount })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === 'User updated successfully!') {
                    setIsEditing(false);
                    onUpdate({ id: studentNumber, name, section, gender, password, microsoftaccount });
                }
            });
    };

    const fieldDisabled = readOnly || !isEditing;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div ref={modalRef} className="montserrat bg-white rounded-2xl shadow-lg p-6 w-100 h-140 flex flex-col">

                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-[#323232] text-xl font-semibold">User Details</h2>
                    <button onClick={onClose}>
                        <img src={ExitIcon} className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2">

                    <div>
                        <label className="text-xs text-[#646464] font-medium mb-1 block">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={fieldDisabled}
                            className={`input w-full ${!fieldDisabled ? "bg-gray-100" : "bg-white"}`}
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-xs font-semibold mb-1 block">Section</label>
                            <input
                                type="text"
                                value={section}
                                onChange={(e) => setSection(e.target.value)}
                                disabled={fieldDisabled}
                                className={`input w-full ${!fieldDisabled ? "bg-gray-100" : "bg-white"}`}
                            />
                        </div>

                        <div className="flex-1">
                            <label className="text-xs font-semibold mb-1 block">Gender</label>
                            <input
                                type="text"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                disabled={fieldDisabled}
                                className={`input w-full ${!fieldDisabled ? "bg-gray-100" : "bg-white"}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold mb-1 block">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={fieldDisabled}
                                className={`input w-full pr-10 ${!fieldDisabled ? "bg-gray-100" : "bg-white"}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-4 top-6 -translate-y-1/2"
                            >
                                <img
                                    src={showPassword ? HidePasswordIcon : ShowPasswordIcon}
                                    className="w-4 h-4"
                                />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold mb-1 block">Student Number</label>
                        <input
                            type="text"
                            value={studentNumber}
                            onChange={(e) => setStudentNumber(e.target.value)}
                            disabled={fieldDisabled}
                            className={`input w-full ${!fieldDisabled ? "bg-gray-100" : "bg-white"}`}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold mb-1 block">Microsoft Account</label>
                        <input
                            type="text"
                            value={microsoftaccount}
                            onChange={(e) => setMicrosoftAccount(e.target.value)}
                            disabled={fieldDisabled}
                            className={`input w-full ${!fieldDisabled ? "bg-gray-100" : "bg-white"}`}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold mb-1 block">User Level</label>
                        <input
                            type="text"
                            value={userLevel}
                            disabled
                            className="input w-full bg-white text-[#646464]"
                        />
                    </div>

                </div>

                {!readOnly && (
                    <div className="flex justify-end mt-5">
                        {isEditing ? (
                            <SaveButton onClick={handleSave} />
                        ) : (
                            <EditButton onClick={() => setIsEditing(true)} />
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

export default ViewUserDetailsPopup;