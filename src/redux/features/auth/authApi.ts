import { baseApi } from "@/redux/api/baseApi";
import type { TAuthResponse } from "./authSlice";

export type TLoginRequest = {
    email: string;
    password: string;
};

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<TAuthResponse, TLoginRequest>({
            query: (userInfo) => ({
                url: '/api/auth/login/',
                method: 'POST',
                body: userInfo
            })
        }),
    })
})

export const { useLoginMutation } = authApi;