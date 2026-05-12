import { baseApi } from "@/redux/api/baseApi";

const professionalHomePageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProfessionalHomePageData: builder.query({
            query: () => ({
                url: '/api/services/requests/pro/homepage/',
                method: 'GET',
            })
        }),
    })
})

export const { useGetProfessionalHomePageDataQuery } = professionalHomePageApi;