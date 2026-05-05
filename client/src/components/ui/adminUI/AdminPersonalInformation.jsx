import { useState, useEffect } from "react";
import { useProfile } from "../../../context/ProfileContext";
import EditButton from "./buttons/EditButton";
import SaveButton from "./buttons/SaveButton";

import NameIcon from '../../../assets/icons/NameIcon.svg';
import EmailIcon from '../../../assets/icons/EmailIcon.svg';
import ContactIcon from '../../../assets/icons/ContactIcon.svg';
import HidePasswordIcon from '../../../assets/icons/HidePasswordIcon.svg';
import ShowPasswordIcon from '../../../assets/icons/ShowPasswordIcon.svg';
import PasswordIcon from "../../../assets/icons/PasswordIcon.svg";
import IdIcon from "../../../assets/icons/IdIcon.svg";

function AdminPersonalInformation() {
    const { setName: setContextName, fetchProfile } = useProfile();
    const [editMode, setEditMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [contact, setContact] = useState("");
    const [microsoftaccount, setMicrosoftaccount] = useState("");
    const [adminId, setAdminId] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('adminToken');

        fetch('${import.meta.env.VITE_API_URL}/api/admin/profile', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                const u = data.user;
                if (!u) return;
                const parts = u.name.split(' ');
                setFirstName(parts[0] || '');
                setLastName(parts.slice(1).join(' ') || '');
                setContact(u.contact || "");
                setPassword(u.password || "");
                setMicrosoftaccount(u.microsoftaccount || "");
                setAdminId(u.id || "");
            });
    }, []);

    const handleSave = () => {
        const token = localStorage.getItem('adminToken');
        const fullName = `${firstName} ${lastName}`.trim();

        fetch('${import.meta.env.VITE_API_URL}/api/admin/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                name: fullName,
                contact,
                password
            })
        }).then(() => {
            setContextName(fullName);
            fetchProfile();
            setEditMode(false);
            setShowPassword(false);
        });
    };

    return (
        <div className="montserrat bg-white rounded-2xl p-6 2xl:p-8 w-full">
            <div className="flex items-center justify-between mb-3 2xl:mb-5">
                <h2 className="text-lg 2xl:text-xl font-semibold text-gray-700">Personal Information</h2>
                {editMode ? <SaveButton onClick={handleSave} /> : <EditButton onClick={() => setEditMode(true)} />}
            </div>

            <div className="grid grid-cols-2 gap-6 2xl:gap-8">
                <div>
                    <label className="text-sm 2xl:text-base font-semibold text-gray-500 mb-1 2xl:mb-2 block">First Name</label>
                    <div className={`input flex items-center ${!editMode ? "bg-white pointer-events-none" : "bg-gray-100"}`}>
                        <img src={NameIcon} className="w-5 h-5 2xl:w-6 2xl:h-6 mr-1 2xl:mr-2" />
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            readOnly={!editMode}
                            className="flex-1 bg-transparent outline-none 2xl:text-base"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm 2xl:text-base font-semibold text-gray-500 mb-1 2xl:mb-2 block">Last Name</label>
                    <div className={`input flex items-center ${!editMode ? "bg-white pointer-events-none" : "bg-gray-100"}`}>
                        <img src={NameIcon} className="w-5 h-5 2xl:w-6 2xl:h-6 mr-1 2xl:mr-2" />
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            readOnly={!editMode}
                            className="flex-1 bg-transparent outline-none 2xl:text-base"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 2xl:mt-8 flex flex-col gap-4 2xl:gap-6">
                <div>
                    <label className="text-sm 2xl:text-base font-semibold text-gray-500 mb-1 2xl:mb-2 block">Password</label>
                    <div className={`input flex items-center justify-between ${!editMode ? "bg-white pointer-events-none" : "bg-gray-100"}`}>
                        <div className="flex items-center flex-1">
                            <img src={PasswordIcon} className="w-5 h-5 2xl:w-6 2xl:h-6 mr-1 2xl:mr-2" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                readOnly={!editMode}
                                className="flex-1 bg-transparent outline-none 2xl:text-base"
                            />
                        </div>
                        <span onClick={() => editMode && setShowPassword(prev => !prev)} className="cursor-pointer">
                            <img src={showPassword ? HidePasswordIcon : ShowPasswordIcon} className="w-4 h-4 2xl:w-5 2xl:h-5" />
                        </span>
                    </div>
                </div>

                <div>
                    <label className="text-sm 2xl:text-base font-semibold text-gray-500 mb-1 2xl:mb-2 block">Admin ID</label>
                    <div className="input flex items-center bg-white pointer-events-none">
                        <img src={IdIcon} className="w-5 h-5 2xl:w-6 2xl:h-6 mr-1 2xl:mr-2" />
                        <input type="text" value={adminId} readOnly className="flex-1 bg-transparent outline-none 2xl:text-base" />
                    </div>
                </div>

                <div>
                    <label className="text-sm 2xl:text-base font-semibold text-gray-500 mb-1 2xl:mb-2 block">Microsoft Account</label>
                    <div className="input flex items-center bg-white pointer-events-none">
                        <img src={EmailIcon} className="w-5 h-5 2xl:w-6 2xl:h-6 mr-1 2xl:mr-2" />
                        <input type="text" value={microsoftaccount} readOnly className="flex-1 bg-transparent outline-none 2xl:text-base" />
                    </div>
                </div>
            </div>

            <div className="mt-6 2xl:mt-8">
                <label className="text-sm 2xl:text-base text-gray-500 mb-1 2xl:mb-2 block">
                    Contact <span className="text-gray-400">(Optional)</span>
                </label>
                <div className={`input flex items-center ${!editMode ? "bg-white pointer-events-none" : "bg-gray-100"}`}>
                    <img src={ContactIcon} className="w-5 h-5 2xl:w-6 2xl:h-6 mr-1 2xl:mr-2" />
                    <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        readOnly={!editMode}
                        maxLength={20}
                        inputMode="numeric"
                        className="flex-1 bg-transparent outline-none 2xl:text-base"
                        onKeyDown={(e) => {
                            if (["Backspace", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
                            if (!/^\d$/.test(e.key)) e.preventDefault();
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default AdminPersonalInformation;


