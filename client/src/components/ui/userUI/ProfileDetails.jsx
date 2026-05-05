import { useEffect, useState } from "react";
import { authFetch } from "../../../utils/authFetch";
import { useProfile } from "../../../context/ProfileContext";
import ProfileImage2 from "../../../assets/images/ProfileImage2.png";

function ProfileDetails() {
    const { profileImg, setProfileImg, name, fetchProfile } = useProfile();
    const [hovering, setHovering] = useState(false);
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            const maxWidth = 300;
            const scale = maxWidth / img.width;
            canvas.width = maxWidth;
            canvas.height = img.height * scale;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const compressed = canvas.toDataURL('image/jpeg', 0.7);
            setProfileImg(compressed);

            authFetch('http://localhost:3000/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name, profile_image: compressed })
            });
        };

        img.src = URL.createObjectURL(file);
    };

    return (
        <div className="montserrat w-full h-auto bg-[#FFFFFF] px-5 py-8 2xl:px-6 2xl:py-9 rounded-2xl">
            <div className="flex items-center gap-3 2xl:gap-5">
                <label
                    className="cursor-pointer flex items-center justify-center"
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                >
                    <img
                        src={profileImg || ProfileImage2}
                        alt="Profile"
                        className="rounded-full w-15 h-15 2xl:w-20 2xl:h-20 object-cover"
                    />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    {hovering && (
                        <div
                            className="fixed z-50 bg-gray-500/80 text-white text-xs 2xl:text-sm px-2 py-1 rounded-md pointer-events-none"
                            style={{ top: `${window.event?.clientY + 10}px`, left: `${window.event?.clientX}px` }}
                        >
                            Change Photo
                        </div>
                    )}
                </label>

                <div className="flex flex-col">
                    <h1 className="font-semibold text-lg 2xl:text-xl">{name?.replace('|', ' ')}</h1>
                    <p className="text-xs 2xl:text-sm text-[#969696]">(Student)</p>
                </div>
            </div>
        </div>
    );
}

export default ProfileDetails;