"use client";

import { Button, Form, Input, Modal, message, theme } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaApple, FaArrowLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  useRegisterMutation,
  useVerifyEmailMutation,
} from "@/redux/features/register/registerApi";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import GoogleButton from "@/components/shared/GoogleLoginButton";

interface SignupFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

type Role = "CUSTOMER" | "PROVIDER";

interface OtpFormValues {
  code: string;
}

const Signup: React.FC = () => {
  const router = useRouter();
  const [form] = Form.useForm<SignupFormValues>();
  const [otpForm] = Form.useForm<OtpFormValues>();
  const { token } = theme.useToken();
  const [selectedRole, setSelectedRole] = useState<Role>("CUSTOMER");
  const [isGoogleRoleOpen, setGoogleRoleOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();

  const onFinish = async (values: SignupFormValues): Promise<void> => {
    try {
      const payload = {
        email: values.email,
        username: values.name,
        password: values.password,
        re_password: values.confirmPassword,
        role: selectedRole === "PROVIDER" ? "PROVIDER" : "CUSTOMER",
        phone_number: values.phone,
      };

      await register(payload).unwrap();
      setPendingEmail(values.email);
      otpForm.resetFields();
      setIsOtpModalOpen(true);
      message.success("Registration initiated. Please verify your OTP.");
    } catch (error) {
      message.error("Signup failed. Please try again.");
    }
  };

  const onOtpFinish = async (values: OtpFormValues): Promise<void> => {
    if (!pendingEmail) {
      message.error("Missing email for verification.");
      return;
    }

    try {
      await verifyEmail({ email: pendingEmail, code: values.code }).unwrap();
      message.success("OTP verified. Account is now active.");
      setIsOtpModalOpen(false);
      setPendingEmail(null);
      otpForm.resetFields();
      router.push("/login");
    } catch (error) {
      message.error("OTP verification failed. Please try again.");
    }
  };

  const handleBack = (): void => {
    router.back();
  };

  const handleAppleSignup = (): void => {
    console.log("Apple signup clicked");
    // Integrate Apple OAuth here
  };

  const inputStyle = {
    backgroundColor: token.colorBgContainer,
    color: token.colorText,
    height: 48,
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 bg-white dark:bg-gray-900 transition-colors pt-20 my-12">
      <div className="shadow-2xl dark:shadow-gray-800/50 rounded-2xl w-full max-w-xl p-8 md:p-16 -mt-25 relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 text-gray-600 dark:text-gray-400 hover:opacity-70 focus:outline-none transition-opacity"
          aria-label="Go Back"
        >
          <FaArrowLeft size={24} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center">
            Create a new Account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            Please enter your information to create account
          </p>
        </div>

        {/* Social Signup Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => setGoogleRoleOpen(true)}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-gray-800 dark:text-white font-medium text-sm shadow-sm"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <button
            onClick={handleAppleSignup}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-gray-800 dark:text-white font-medium text-sm shadow-sm"
          >
            <FaApple size={20} className="text-gray-900 dark:text-white" />
            Continue with Apple
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
          <span className="text-xs text-gray-400 font-medium">or</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
        </div>

        <Modal
          open={isGoogleRoleOpen}
          onCancel={() => setGoogleRoleOpen(false)}
          footer={null}
          centered
          title="Choose account type"
        >
          <div className="flex flex-col gap-3">
            <GoogleButton
              role="CUSTOMER"
              onClick={() => setGoogleRoleOpen(false)}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-4 bg-white hover:bg-gray-50 transition-all text-gray-800 font-medium text-sm shadow-sm"
            >
              <FcGoogle size={20} />
              Signup as customer
            </GoogleButton>
            <GoogleButton
              role="PROVIDER"
              onClick={() => setGoogleRoleOpen(false)}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-4 bg-white hover:bg-gray-50 transition-all text-gray-800 font-medium text-sm shadow-sm"
            >
              <FcGoogle size={20} />
              Signup as provider
            </GoogleButton>
          </div>
        </Modal>

        {/* Signup Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-1"
        >
          {/* Name */}
          <Form.Item
            label={
              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                Username
              </span>
            }
            name="name"
            rules={[
              { required: true, message: "Please enter your name" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input
              placeholder="Enter name here"
              size="large"
              style={inputStyle}
              className="rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            />
          </Form.Item>

          {/* Email */}
          <Form.Item
            label={
              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                Email
              </span>
            }
            name="email"
            rules={[
              { type: "email", message: "Please enter a valid email address" },
              { required: true, message: "Please enter your email" },
            ]}
          >
            <Input
              placeholder="Esteban_schiller@gmail.com"
              size="large"
              style={inputStyle}
              className="rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            />
          </Form.Item>

          {/* Phone */}
          <Form.Item
            label={
              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                Phone
              </span>
            }
            name="phone"
            rules={[
              { required: true, message: "Please enter your phone number" },
              {
                pattern: /^[0-9+\-\s()]{7,15}$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input
              placeholder="Enter phone"
              size="large"
              style={inputStyle}
              className="rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label={
              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                Password
              </span>
            }
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
            hasFeedback
          >
            <Input.Password
              placeholder="Enter Password"
              size="large"
              style={inputStyle}
              className="rounded-xl bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            />
          </Form.Item>

          <Form.Item<SignupFormValues>
            label={
              <span className="font-semibold text-gray-900 dark:text-white transition-colors">
                Confirm Password
              </span>
            }
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm your password"
              size="large"
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 transition-colors"
              style={{
                backgroundColor: token.colorBgContainer,
                color: token.colorText,
              }}
            />
          </Form.Item>

          {/* Role Selector */}
          <Form.Item
            label={
              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                Select Your Role
              </span>
            }
          >
            <div className="flex flex-col gap-3">
              {/* Customer Option */}
              <button
                type="button"
                onClick={() => setSelectedRole("CUSTOMER")}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all ${selectedRole === "CUSTOMER"
                  ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20"
                  : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-gray-300"
                  }`}
              >
                <span
                  className={`font-medium text-sm ${selectedRole === "CUSTOMER"
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-gray-700 dark:text-gray-300"
                    }`}
                >
                  Customer
                </span>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedRole === "CUSTOMER"
                    ? "border-amber-500 bg-amber-500"
                    : "border-gray-300 dark:border-gray-500"
                    }`}
                >
                  {selectedRole === "CUSTOMER" && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </button>

              {/* Professional Option */}
              <button
                type="button"
                onClick={() => setSelectedRole("PROVIDER")}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all ${selectedRole === "PROVIDER"
                  ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20"
                  : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-gray-300"
                  }`}
              >
                <span
                  className={`font-medium text-sm ${selectedRole === "PROVIDER"
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-gray-700 dark:text-gray-300"
                    }`}
                >
                  Professional
                </span>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedRole === "PROVIDER"
                    ? "border-amber-500 bg-amber-500"
                    : "border-gray-300 dark:border-gray-500"
                    }`}
                >
                  {selectedRole === "PROVIDER" && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </button>
            </div>
          </Form.Item>

          {/* Submit */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isRegistering}
              className="w-full font-bold text-base transition-all hover:scale-[1.02]"
              style={{
                height: 52,
                backgroundColor: "#F59E0B",
                borderColor: "#F59E0B",
              }}
            >
              {isRegistering ? "Creating Account..." : "Sign Up"}
            </Button>
          </Form.Item>

          {/* Login Link */}
          <p className="text-center pt-2 text-gray-700 dark:text-gray-300 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold underline">
              Login
            </Link>
          </p>
        </Form>
      </div>

      <Modal
        title="Verify your email"
        open={isOtpModalOpen}
        onCancel={() => {
          setIsOtpModalOpen(false);
          otpForm.resetFields();
        }}
        onOk={() => otpForm.submit()}
        confirmLoading={isVerifying}
        okText="Verify"
        centered
      >
        <Form
          form={otpForm}
          layout="vertical"
          onFinish={onOtpFinish}
          className="pt-2"
        >
          <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-sm dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
            <p className="font-semibold">A six digit OTP is sent to your email.</p>
            <p>Check your email now. Enter the OTP below to activate your account.</p>
          </div>
          <Form.Item
            name="code"
            rules={[{ required: true, message: "Please enter the OTP" }]}
          >
            <div className="flex justify-center">
              <InputOTP maxLength={6} autoFocus>
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="h-14 w-12 text-lg font-semibold" />
                  <InputOTPSlot index={1} className="h-14 w-12 text-lg font-semibold" />
                  <InputOTPSlot index={2} className="h-14 w-12 text-lg font-semibold" />
                  <InputOTPSlot index={3} className="h-14 w-12 text-lg font-semibold" />
                  <InputOTPSlot index={4} className="h-14 w-12 text-lg font-semibold" />
                  <InputOTPSlot index={5} className="h-14 w-12 text-lg font-semibold" />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Signup;
