import { useState } from "react";
import SignInImage from "../../assets/images/SignInImage.png";
import LoginLayout from "../../components/layout/userLayout/componentLayout/LoginLayout";
import RegisterLayout from "../../components/layout/userLayout/componentLayout/RegisterLayout";

function LogInPage() {
  const [isRegister, setIsRegister] = useState(false);
  const reason = new URLSearchParams(window.location.search).get("reason");

  return (
    <div className="flex h-screen w-full montserrat bg-[#F9F9F9] overflow-hidden">
      <div className="hidden md:flex w-1/2 pt-8 flex-col">
        <div className="px-10">
          <h2 className="text-lg font-semibold text-gray-800">
            Lost Today, Found Tomorrow
          </h2>
          <p className="text-sm text-gray-500">
            Your shortcut to recovering what's missing. Simple, secure, and
            stress-free.
          </p>
        </div>

        <div className="-ml-50">
          <img src={SignInImage} alt="preview" className="w-210" />
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6">
        {reason === "deleted" && (
          <p className="absolute top-4 text-red-500 text-sm font-medium">
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