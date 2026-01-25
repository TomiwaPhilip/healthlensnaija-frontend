import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const PendingVerification = () => {
  const [email, setEmail] = useState("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    if (emailParam) setEmail(emailParam);
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <img src={logo} alt="Logo" className="h-16 mb-6" />
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Verify Your Email</h2>
      <p className="text-gray-600 max-w-md">
        {email
          ? <>We’ve sent a verification link to <b>{email}</b>. Please check your inbox (and spam folder).</>
          : "We’ve sent a verification link to your email. Please check your inbox."}
      </p>
      <p className="text-gray-500 text-sm mt-2">
        Didn’t get it? It may take a minute or two to arrive.
      </p>
      <div className="mt-8">
        <Link
          to="/signin"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Return to Sign In
        </Link>
      </div>
    </div>
  );
};

export default PendingVerification;
