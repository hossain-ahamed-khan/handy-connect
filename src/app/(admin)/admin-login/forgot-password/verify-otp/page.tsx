"use client";

import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";
import Image from "next/image";
import mainLogoAdmin from "../../../../../assets/main-logo-admin.png"

const CODE_LENGTH = 6;

export default function CheckEmailForm() {
    const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        const char = value.replace(/\D/g, "").slice(-1);
        const next = [...digits];
        next[index] = char;
        setDigits(next);
        if (char && index < CODE_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (digits[index]) {
                const next = [...digits];
                next[index] = "";
                setDigits(next);
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
        if (!pasted) return;
        const next = [...digits];
        pasted.split("").forEach((char, i) => { next[i] = char; });
        setDigits(next);
        const focusIndex = Math.min(pasted.length, CODE_LENGTH - 1);
        inputRefs.current[focusIndex]?.focus();
    };

    const handleVerify = async () => {
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 1500));
        setIsLoading(false);
    };

    const handleResend = () => {
        setDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
    };

    const isFilled = digits.every((d) => d !== "");

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <Image src={mainLogoAdmin} alt="Main Logo" className="w-24 h-24 object-contain" />
                </div>

                {/* Heading */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-amber-400 mb-3">
                        Check your email
                    </h1>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        We sent a code to your email address @. Please check
                        <br />
                        your email for the 6 digit code.
                    </p>
                </div>

                {/* OTP Inputs */}
                <div className="flex justify-center gap-3 mb-8">
                    {digits.map((digit, i) => (
                        <input
                            key={i}
                            ref={(el) => { inputRefs.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            onPaste={handlePaste}
                            className={`
                w-12 h-12 text-center text-lg font-semibold rounded-lg border-2 outline-none
                transition-all duration-200 text-gray-700
                ${digit
                                    ? "border-amber-400 bg-white"
                                    : "border-gray-200 bg-white"
                                }
                focus:border-amber-400 focus:ring-2 focus:ring-amber-100
                caret-amber-400
              `}
                        />
                    ))}
                </div>

                {/* Verify Button */}
                <button
                    type="button"
                    onClick={handleVerify}
                    disabled={isLoading || !isFilled}
                    className="w-full py-3 rounded-md bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-white font-medium text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-10 cursor-pointer"
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
                            Verifying…
                        </>
                    ) : (
                        "Verify"
                    )}
                </button>

                {/* Resend */}
                <p className="text-center text-sm text-gray-500">
                    You have not received the email?{" "}
                    <button
                        type="button"
                        onClick={handleResend}
                        className="text-gray-700 font-medium underline underline-offset-2 hover:text-amber-500 transition-colors cursor-pointer"
                    >
                        Resend
                    </button>
                </p>
            </div>
        </div>
    );
}