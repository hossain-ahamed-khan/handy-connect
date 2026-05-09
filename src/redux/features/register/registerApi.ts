import { baseApi } from "@/redux/api/baseApi";

const registerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userInfo) => ({
                url: '/api/auth/register/',
                method: 'POST',
                body: userInfo
            })
        }),
    })
})

export const { useRegisterMutation } = registerApi;





const verifyEmailApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        verifyEmail: builder.mutation({
            query: (formData) => ({
                url: '/api/auth/verify-otp/',
                method: 'POST',
                body: formData
            })
        }),
    })
})

export const { useVerifyEmailMutation } = verifyEmailApi;