'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import { useGoogleLoginMutation } from '@/redux/features/googleLogin/googleLoginApi';
import { setUser, type TUser } from '@/redux/features/auth/authSlice';
import { useAppDispatch } from '@/redux/hooks';

type GoogleButtonProps = {
    role: TUser['role'];
    className?: string;
    children?: ReactNode;
    onClick?: () => void;
};

export default function GoogleButton({ role, className, children, onClick }: GoogleButtonProps) {
    const [googleLogin] = useGoogleLoginMutation();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await googleLogin({
                    access_token: tokenResponse.access_token,
                    role,
                }).unwrap();

                dispatch(setUser(response));

                const roleRedirects: Record<TUser['role'], string> = {
                    CUSTOMER: '/user-dashboard',
                    PROVIDER: '/professional-dashboard',
                    ADMIN: '/admin-dashboard',
                };

                const roleRedirect = roleRedirects[response.user.role as TUser['role']];
                router.push(roleRedirect || '/');
                toast.success('Login successful.');
            } catch (err) {
                console.error('Google login error:', err);
                const errorMessage = (err as Error)?.message || 'Something went wrong!';
                toast.error(`Login failed: ${errorMessage}`);
            }
        },
        onError: () => {
            toast.error('Google Login Failed');
        },
    });

    const handleClick = (): void => {
        onClick?.();
        login();
    };

    return (
        <button onClick={handleClick} className={className}>
            {children || 'Continue with Google'}
        </button>
    );
}