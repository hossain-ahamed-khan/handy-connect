import { baseApi } from "@/redux/api/baseApi";

const providerListApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProviderList: builder.query({
            query: () => ({
                url: '/api/services/providers/',
                method: 'GET',
            })
        }),
    })
})

export const { useGetProviderListQuery } = providerListApi;