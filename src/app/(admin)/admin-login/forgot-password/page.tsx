"use client";

import { useState } from "react";
import Image from "next/image";
import mainLogoAdmin from "../../../../assets/main-logo-admin.png"

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 1500));
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <Image src={mainLogoAdmin} alt="Main Logo" className="w-24 h-24 object-contain" />
                </div>

                {/* Heading */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-amber-400 mb-2">
                        Forget Password?
                    </h1>
                    <p className="text-sm text-gray-500">
                        Please enter your email to get verification code
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-5">
                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="block text-sm text-gray-600 font-medium">
                            Email address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full py-3 rounded-md bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white font-medium text-sm transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    />
                                </svg>
                                Sending…
                            </>
                        ) : (
                            "Continue"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}