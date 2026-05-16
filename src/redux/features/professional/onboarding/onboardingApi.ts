import { baseApi } from "@/redux/api/baseApi";

const onboardingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        onboarding: builder.mutation({
            query: (formData) => ({
                url: '/api/pro/onboarding/',
                method: 'PATCH',
                body: formData
            })
        }),
    })
})

export const { useOnboardingMutation } = onboardingApi;