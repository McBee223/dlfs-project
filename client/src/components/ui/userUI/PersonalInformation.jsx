import { useState, useEffect } from "react";
import { authFetch } from "../../../utils/authFetch";
import { useProfile } from "../../../context/ProfileContext";
import EditButton from "./buttons/EditButton";
import SaveButton from "./buttons/SaveButton";
import GenderPopup from "./popups/GenderPopup";

import NameIcon from '../../../assets/icons/NameIcon.svg';
import EmailIcon from '../../../assets/icons/EmailIcon.svg';
import ContactIcon from '../../../assets/icons/ContactIcon.svg';

function PersonalInformation() {
    const [editMode, setEditMode] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [localGender, setLocalGender] = useState("");
    const [localContact, setLocalContact] = useState("");

    const { name, setName, gender, setGender, contact, setContact, microsoftaccount, fetchProfile } = useProfile();
    const token = localStorage.getItem('userToken');

    // Sync name from context → local fields (skip while editing)
    useEffect(() => {
        if (!name || name === "Loading...") return;
        if (editMode) return;
        const parts = name.split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
    }, [name, editMode]);

    // Sync gender from context → local field (skip while editing)
    useEffect(() => {
        if (editMode) return;
        setLocalGender(gender);
    }, [gender, editMode]);

    // Sync contact from context → local field (skip while editing)
    useEffect(() => {
        if (editMode) return;
        setLocalContact(contact);
    }, [contact, editMode]);

    const handleSave = () => {
        const fullName = `${firstName} ${lastName}`.trim();

        authFetch('http://localhost:3000/api/user/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ name: fullName, gender: localGender, contact: localContact })
        }).then(() => {
            setName(fullName);
            setGender(localGender);
            setContact(localContact);
            fetchProfile();
            setEditMode(false);
        });
    };

    return (
        <div className="montserrat bg-white rounded-2xl p-6 w-full">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-700">Personal Information</h2>
                {editMode ? <SaveButton onClick={handleSave} /> : <EditButton onClick={() => setEditMode(true)} />}
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="text-sm font-semibold text-gray-500 mb-1 block">First Name</label>
                    <div className={`flex items-center border rounded-lg px-3 input w-full ${!editMode ? "bg-white pointer-events-none" : "bg-gray-100"}`}>
                        <img src={NameIcon} className="w-5 h-5 mr-1" />
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            readOnly={!editMode}
                            className="flex-1 focus:outline-none bg-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-500 mb-1 block">Last Name</label>
                    <div className={`flex items-center border rounded-lg px-3 input w-full ${!editMode ? "bg-white pointer-events-none" : "bg-gray-100"}`}>
                        <img src={NameIcon} className="w-5 h-5 mr-1" />
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            readOnly={!editMode}
                            className="flex-1 focus:outline-none bg-transparent"
                        />
                    </div>
                </div>

                <div>
                    <GenderPopup
                        disabled={!editMode}
                        value={localGender}
                        onChange={setLocalGender}
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-500 mb-1 block">Microsoft Account</label>
                    <div className="relative">
                        <img src={EmailIcon} className="absolute left-4 top-6 -translate-y-1/2" />
                        <input
                            type="text"
                            value={microsoftaccount}
                            readOnly
                            className="input pl-10 w-full bg-white pointer-events-none focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <label className="text-sm text-gray-500 mb-1 block">
                    Contact <span className="text-gray-400">(Optional)</span>
                </label>
                <div className={`flex items-center border rounded-lg px-3 input w-full ${!editMode ? "bg-white pointer-events-none" : "bg-gray-100"}`}>
                    <img src={ContactIcon} className="w-5 h-5 mr-1" />
                    <input
                        type="text"
                        value={localContact}
                        onChange={(e) => setLocalContact(e.target.value)}
                        readOnly={!editMode}
                        maxLength={20}
                        inputMode="numeric"
                        className="flex-1 focus:outline-none bg-transparent"
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

export default PersonalInformation;