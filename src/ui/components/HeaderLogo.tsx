import React from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function HeaderLogo() {

    const navigate = useNavigate();
    const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

    return (
        <div className="flex items-center bg-gradient-to-br from-purple-50 to-neutral-0  justify-between p-5 ">
            <img
                src="/hiringLogo.png"
                alt="Logo"
                className="h-8 w-28 object-contain"
            />
            <button onClick={handleLogout} className="text-xs font-bold w-24 h-8 text-white bg-violet-700 rounded-full ">LOGOUT</button>
        </div>
    );
}

