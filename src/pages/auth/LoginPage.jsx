import React, { useState } from "react";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [showPass, setShowPass] = useState(false);
  return (
    <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
      <form className="w-[35%] h-auto p-10 rounded-md shadow-2xl bg-white flex flex-col items-center gap-6">
        <h1 className="font-bold text-3xl">Login into your account!</h1>
        <div className="w-full">
          <input
            type="email"
            placeholder="Email address"
            className="w-full border py-3 px-4 rounded-md outline-none"
          />
        </div>
        <div className="w-full">
          <div className="w-full border rounded-md flex items-center justify-between px-4">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="w-full py-3 rounded-md outline-none"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}>
              {showPass ? (
                <IoEyeOutline className="text-lg text-gray-500" />
              ) : (
                <IoEyeOffOutline className="text-lg text-gray-500" />
              )}
            </button>
          </div>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-gray-500 mt-1 float-end"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="w-full">
          <button className="w-full bg-[#c00000] py-3 rounded-md text-white font-semibold text-[15px]">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
