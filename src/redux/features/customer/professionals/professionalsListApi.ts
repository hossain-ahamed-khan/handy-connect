import { baseApi } from "@/redux/api/baseApi";

const professionalsListApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProfessionalsList: builder.query({
            query: () => ({
                url: '/api/services/providers/',
                method: 'GET',
            })
        }),
    })
})

export const { useGetProfessionalsListQuery } = professionalsListApi;





const professionalsDetailsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProfessionalsDetails: builder.query({
            query: (id: number) => ({
                url: `/api/services/providers/${id}/`,
                method: 'GET',
            })
        }),
    })
})

export const { useGetProfessionalsDetailsQuery } = professionalsDetailsApi;