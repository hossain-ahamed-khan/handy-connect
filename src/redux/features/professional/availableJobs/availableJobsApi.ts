import { baseApi } from "@/redux/api/baseApi";

const availableJobsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAvailableJobs: builder.query({
            query: () => ({
                url: '/api/services/requests/',
                method: 'GET',
            })
        }),
    })
})

export const { useGetAvailableJobsQuery } = availableJobsApi;