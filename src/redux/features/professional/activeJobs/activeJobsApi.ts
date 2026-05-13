import { baseApi } from "@/redux/api/baseApi";

const activeJobsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getActiveJobs: builder.query({
            query: () => ({
                url: '/api/services/requests/pro/requests/',
                method: 'GET',
            }),
            providesTags: ['ActiveJobs']
        }),
    })
})

export const { useGetActiveJobsQuery } = activeJobsApi;