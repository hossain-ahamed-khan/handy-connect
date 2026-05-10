"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
} from "@/redux/features/forgotPassword/forgotPasswordApi";

type Step = "forgot" | "verify" | "reset";

const RESET_EMAIL_KEY = "reset_email";
const RESET_OTP_KEY = "reset_otp";

export default function ForgotPasswordFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("forgot");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const [forgotPassword, { isLoading: isSendingEmail }] =
    useForgotPasswordMutation();
  const [verifyResetOtp, { isLoading: isVerifyingOtp }] =
    useVerifyResetOtpMutation();
  const [resetPassword, { isLoading: isResettingPassword }] =
    useResetPasswordMutation();

  const handleClose = () => {
    router.push("/login");
  };

  const handleSendEmail = async () => {
    if (!email) return;
    setError("");
    try {
      await forgotPassword(email).unwrap();
      localStorage.setItem(RESET_EMAIL_KEY, email);
      setStep("verify");
    } catch (err) {
      setError("Unable to send reset OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!email || otp.length !== 6) return;
    setError("");
    try {
      await verifyResetOtp({ email, code: otp }).unwrap();
      localStorage.setItem(RESET_OTP_KEY, otp);
      setStep("reset");
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    const storedEmail = localStorage.getItem(RESET_EMAIL_KEY) || email;
    const storedOtp = localStorage.getItem(RESET_OTP_KEY) || otp;

    if (!storedEmail || storedOtp.length !== 6) return;
    if (!newPassword || newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    try {
      await resetPassword({
        email: storedEmail,
        code: storedOtp,
        new_password: newPassword,
        re_new_password: confirmPassword,
      }).unwrap();
      localStorage.removeItem(RESET_EMAIL_KEY);
      localStorage.removeItem(RESET_OTP_KEY);
      toast.success("Password reset successfully.");
      handleClose();
      router.push("/login");
    } catch (err) {
      setError("Password reset failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* ── Step 1: Forgot Password ── */}
        {step === "forgot" && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Forgot Password
              </h1>
              <p className="text-gray-500 text-sm">
                Please enter your email to continue
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Esteban_schiller@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-gray-100 border-0 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <button
              onClick={handleSendEmail}
              disabled={!email || isSendingEmail}
              className="w-full rounded-xl bg-amber-400 hover:bg-amber-500 transition-colors text-white font-semibold py-3.5 text-sm disabled:opacity-60 cursor-pointer"
            >
              {isSendingEmail ? "Sending..." : "Send"}
            </button>
          </div>
        )}

        {/* ── Step 2: Check Your Email / OTP ── */}
        {step === "verify" && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Check Your Email
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                We sent a reset link to{" "}
                <span className="text-gray-700 font-medium">
                  {email.length > 20
                    ? email.slice(0, 17) + "..."
                    : email}
                </span>
                <br />
                enter 6-digit code that mentioned in the email
              </p>
            </div>

            {/* shadcn InputOTP */}
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(val) => setOtp(val)}
              >
                <InputOTPGroup className="gap-3">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="w-12 h-12 rounded-xl border border-gray-200 text-lg font-semibold text-gray-800 focus:border-amber-400 focus:ring-amber-400"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <button
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6 || isVerifyingOtp}
              className="w-full rounded-xl bg-amber-400 hover:bg-amber-500 transition-colors text-white font-semibold py-3.5 text-sm disabled:opacity-60 cursor-pointer"
            >
              {isVerifyingOtp ? "Verifying..." : "Verify"}
            </button>
          </div>
        )}

        {/* ── Step 3: Set New Password ── */}
        {step === "reset" && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Set a new password
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Create a new password. Ensure it differs from
                <br />
                previous ones for security
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="Enter Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl bg-gray-100 border-0 px-4 py-3 pr-11 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNew ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Enter Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl bg-gray-100 border-0 px-4 py-3 pr-11 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <button
              onClick={handleResetPassword}
              disabled={
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword ||
                isResettingPassword
              }
              className="w-full rounded-xl bg-amber-400 hover:bg-amber-500 transition-colors text-white font-semibold py-3.5 text-sm disabled:opacity-60 cursor-pointer"
            >
              {isResettingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}