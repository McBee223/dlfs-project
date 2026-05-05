import { useRef, useEffect, useState } from "react";
import { useProfile } from "../../../../context/ProfileContext";
import ExitIcon from "../../../../assets/icons/ExitIcon.svg";
import EditButton from "../../../ui/adminUI/buttons/EditButton";
import SaveButton from "../../../ui/adminUI/buttons/SaveButton";
import ShowPasswordIcon from "../../../../assets/icons/ShowPasswordIcon.svg";
import HidePasswordIcon from "../../../../assets/icons/HidePasswordIcon.svg";

function ViewAdminDetailsPopup({ onClose, admin, onUpdate, readOnly = false }) {
    const [showPassword, setShowPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState(admin?.password || "");
    const [adminId, setAdminId] = useState(admin?.id || "");
    const [microsoftaccount, setMicrosoftAccount] = useState(admin?.microsoftaccount || "");
    const [userLevel] = useState(admin?.role || "Admin");

    const originalId = admin?.id;
    const { setName: setContextName } = useProfile();
    const modalRef = useRef();
    const token = localStorage.getItem('adminToken');

    useEffect(() => {
        if (admin?.name) {
            const parts = admin.name.split(' ');
            setFirstName(parts[0] || '');
            setLastName(parts.slice(1).join(' ') || '');
        }
    }, [admin]);

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
        const fullName = `${firstName} ${lastName}`.trim();

        fetch(`${import.meta.env.VITE_API_URL}/api/admin/admins/${originalId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ id: adminId, name: fullName, password, microsoftaccount })
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === 'Admin updated successfully!') {
                    setContextName(fullName);
                    setIsEditing(false);
                    const updatedAdmin = { id: adminId, name: fullName, password, microsoftaccount, role: userLevel };
                    localStorage.setItem('admin', JSON.stringify(updatedAdmin));
                    if (data.token) {
                        localStorage.setItem('adminToken', data.token);
                    }
                    onUpdate({ id: adminId, name: fullName, password, microsoftaccount });
                }
            });
    };

    const fieldDisabled = readOnly || !isEditing;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div ref={modalRef} className="montserrat bg-white rounded-2xl shadow-lg p-6 2xl:p-8 w-100 2xl:w-120">

                <div className="flex justify-between items-center mb-5 2xl:mb-6">
                    <h2 className="text-[#323232] text-xl 2xl:text-2xl font-semibold">Admin Details</h2>
                    <button onClick={onClose} className="focus:outline-none focus:ring-0">
                        <img src={ExitIcon} className="w-5 h-5 2xl:w-6 2xl:h-6" />
                    </button>
                </div>

                <div className="flex flex-col">
                    <div className="flex gap-2 2xl:gap-3">
                        <div className="flex-1">
                            <label className="text-xs 2xl:text-sm text-[#000000] font-semibold mb-1 2xl:mb-2 block">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                disabled={fieldDisabled}
                                className={`input 2xl:text-base w-full ${!fieldDisabled ? "bg-gray-100" : "bg-white"}`}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs 2xl:text-sm text-[#000000] font-semibold mb-1 2xl:mb-2 block">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                disabled={fieldDisabled}
                                className={`input 2xl:text-base w-full ${!fieldDisabled ? "bg-gray-100" : "bg-white"}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs 2xl:text-sm font-semibold mb-1 2xl:mb-2 block">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={fieldDisabled}
                                className={`input 2xl:text-base w-full pr-10 ${!fieldDisabled ? "bg-gray-100" : "bg-white"}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-4 2xl:right-5 top-6 -translate-y-1/2"
                            >
                                <img src={showPassword ? HidePasswordIcon : ShowPasswordIcon} className="w-4 h-4 2xl:w-5 2xl:h-5" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs 2xl:text-sm text-[#000000] font-semibold mb-1 2xl:mb-2 block">Admin ID</label>
                        <input
                            type="text"
                            value={adminId}
                            onChange={(e) => setAdminId(e.target.value)}
                            disabled={fieldDisabled}
                            className={`input 2xl:text-base w-full ${!fieldDisabled ? "bg-gray-100" : "bg-white"}`}
                        />
                    </div>

                    <div>
                        <label className="text-xs 2xl:text-sm text-[#000000] font-semibold mb-1 2xl:mb-2 block">Microsoft Account</label>
                        <input
                            type="text"
                            value={microsoftaccount}
                            onChange={(e) => setMicrosoftAccount(e.target.value)}
                            disabled={fieldDisabled}
                            className={`input 2xl:text-base w-full ${!fieldDisabled ? "bg-gray-100" : "bg-white"}`}
                        />
                    </div>

                    <div>
                        <label className="text-xs 2xl:text-sm text-[#000000] font-semibold mb-1 2xl:mb-2 block">User Level</label>
                        <input
                            type="text"
                            value={userLevel}
                            disabled
                            className="input 2xl:text-base w-full bg-white text-[#646464]"
                        />
                    </div>
                </div>

                {!readOnly && (
                    <div className="flex justify-end mt-5 2xl:mt-6">
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

export default ViewAdminDetailsPopup;



