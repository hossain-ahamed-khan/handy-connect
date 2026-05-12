import { baseApi } from "@/redux/api/baseApi";

const homePageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getHomePageData: builder.query({
            query: ({ providerId }) => ({
                url: `/api/services/providers/${providerId}/`,
                method: 'GET',
            })
        }),
    })
})

export const { useGetHomePageDataQuery } = homePageApi;