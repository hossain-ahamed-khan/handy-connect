import { baseApi } from "@/redux/api/baseApi";

const homePageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getHomePageData: builder.query({
            query: () => ({
                url: '/api/services/requests/customer/homepage/',
                method: 'GET',
            })
        }),
    })
})

export const { useGetHomePageDataQuery } = homePageApi;