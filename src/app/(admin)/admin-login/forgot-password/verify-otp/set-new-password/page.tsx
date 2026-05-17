"use client";

import { useState } from "react";
import Image from "next/image";
import mainLogoAdmin from "../../../../../../assets/main-logo-admin.png"

const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

interface PasswordFieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    onToggle: () => void;
    error?: string;
}

const PasswordField = ({ label, value, onChange, show, onToggle, error }: PasswordFieldProps) => (
    <div className="space-y-1.5">
        <label className="block text-sm text-gray-600 font-medium">{label}</label>
        <div className="relative">
            <input
                type={show ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 pr-11 border rounded-md text-sm text-gray-700 placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-amber-100 ${error ? "border-red-400 focus:border-red-400" : "border-gray-300 focus:border-amber-400"
                    }`}
            />
            <button
                type="button"
                onClick={onToggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
                {show ? <EyeIcon /> : <EyeOffIcon />}
            </button>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
);

export default function SetNewPasswordForm() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        setError("");
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
                        Set a new password
                    </h1>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Create a new password. Ensure it differs from
                        <br />
                        previous ones for security
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-5">
                    <PasswordField
                        label="New Password"
                        value={newPassword}
                        onChange={(v) => { setNewPassword(v); setError(""); }}
                        show={showNew}
                        onToggle={() => setShowNew((p) => !p)}
                    />

                    <PasswordField
                        label="Confirm Password"
                        value={confirmPassword}
                        onChange={(v) => { setConfirmPassword(v); setError(""); }}
                        show={showConfirm}
                        onToggle={() => setShowConfirm((p) => !p)}
                        error={error}
                    />

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
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Resetting…
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}