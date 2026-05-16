"use client";

import { Button, Checkbox, Form, Input, Modal, theme } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { FaApple, FaArrowLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import GoogleLoginButton from "@/components/shared/GoogleLoginButton";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setUser, type TUser } from "@/redux/features/auth/authSlice";
import { toast } from "sonner";

interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

const LoginContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm<LoginFormValues>();
  const { token } = theme.useToken();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const [isGoogleRoleOpen, setGoogleRoleOpen] = useState(false);

  const redirectPath = searchParams.get("from") || "/";
  const onFinish = async (values: LoginFormValues): Promise<void> => {
    try {
      const response = await login(values).unwrap();
      dispatch(setUser(response));

      const roleRedirects: Record<TUser["role"], string> = {
        CUSTOMER: "/user-dashboard",
        PROVIDER: "/professional-dashboard",
        ADMIN: "/admin-dashboard",
      };

      const roleRedirect = roleRedirects[response.user.role];
      const providerRedirect =
        response.user.role === "PROVIDER" &&
          response.user.onboarding_status === "ACCOUNT_CREATED"
          ? "/professional-onboarding"
          : roleRedirect;

      router.push(providerRedirect || redirectPath);
      toast.success("Login successful.");
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = (error as Error)?.message || "Something went wrong!";
      toast.error(`Login failed: ${errorMessage}`);
    }
  };

  const handleBack = (): void => {
    router.back();
  };

  const handleAppleLogin = (): void => {
    console.log("Apple login clicked");
    // 🔥 Integrate Apple OAuth here
  };

  const inputStyle = {
    backgroundColor: token.colorBgContainer,
    color: token.colorText,
    height: 48,
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 bg-white dark:bg-gray-900 transition-colors my-12">
      <div className="shadow-2xl dark:shadow-gray-800/50 rounded-2xl w-full max-w-xl p-8 md:p-16 -mt-50 relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 hover:opacity-70 focus:outline-none transition-opacity text-gray-600 dark:text-gray-400"
          aria-label="Go Back"
        >
          <FaArrowLeft size={24} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center">
            Login to Account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
            Please enter your email and password to continue
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => setGoogleRoleOpen(true)}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-gray-800 dark:text-white font-medium text-sm shadow-sm"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <button
            onClick={handleAppleLogin}
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
            <GoogleLoginButton
              role="CUSTOMER"
              onClick={() => setGoogleRoleOpen(false)}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-4 bg-white hover:bg-gray-50 transition-all text-gray-800 font-medium text-sm shadow-sm"
            >
              <FcGoogle size={20} />
              Login as customer
            </GoogleLoginButton>
            <GoogleLoginButton
              role="PROVIDER"
              onClick={() => setGoogleRoleOpen(false)}
              className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-4 bg-white hover:bg-gray-50 transition-all text-gray-800 font-medium text-sm shadow-sm"
            >
              <FcGoogle size={20} />
              Login as provider
            </GoogleLoginButton>
          </div>
        </Modal>

        {/* Login Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-1"
        >
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

          {/* Submit Button */}
          <Form.Item className="mt-2 mb-2">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isLoading}
              className="w-full font-bold text-base transition-all hover:scale-[1.02]"
              style={{
                height: 52,
                backgroundColor: "#F59E0B",
                borderColor: "#F59E0B",
              }}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </Form.Item>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center">
            <Form.Item<LoginFormValues>
              name="remember"
              valuePropName="checked"
              className="mb-0"
            >
              <Checkbox>
                <span className="font-bold text-gray-900 dark:text-white transition-colors">
                  Remember me
                </span>
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Link
                href="/forgot-password"
                className="font-bold underline hover:opacity-80 transition-opacity dark:text-white"
              >
                Forgot password?
              </Link>
            </Form.Item>
          </div>

          {/* Signup Link */}
          <p className="text-center pt-2 text-sm">
            {"Don't have an account? "}
            <Link
              href="/signup"
              className="text-blue-600 dark:text-blue-400 font-bold underline hover:opacity-80 transition-opacity"
            >
              Create Account
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

const Login: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex justify-center items-center bg-white dark:bg-gray-900">
          <div className="text-gray-900 dark:text-white">Loading...</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
};

export default Login;
