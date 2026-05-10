import { baseApi } from "@/redux/api/baseApi";

const googleLoginApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        googleLogin: builder.mutation({
            query: (googleLoginData) => ({
                url: '/api/auth/google/',
                method: 'POST',
                body: googleLoginData
            })
        }),
    })
})

export const { useGoogleLoginMutation } = googleLoginApi;