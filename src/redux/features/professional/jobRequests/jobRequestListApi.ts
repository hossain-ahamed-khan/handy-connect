import { baseApi } from "@/redux/api/baseApi";

const jobRequestListApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getJobRequestList: builder.query({
            query: () => ({
                url: '/api/services/requests/pro/requests/',
                method: 'GET',
            })
        }),
    })
})

export const { useGetJobRequestListQuery } = jobRequestListApi;