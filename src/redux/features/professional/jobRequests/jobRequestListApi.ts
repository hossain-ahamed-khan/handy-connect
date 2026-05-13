import { baseApi } from "@/redux/api/baseApi";

const jobRequestListApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getJobRequestList: builder.query({
            query: () => ({
                url: '/api/services/requests/pro/requests/',
                method: 'GET',
            }),
            providesTags: ['ActiveJobs']
        }),
    })
})

export const { useGetJobRequestListQuery } = jobRequestListApi;





const responseToJobRequestApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        responseToJobRequest: builder.mutation({
            query: ({ action, requestId }) => ({
                url: `/api/services/requests/${requestId}/respond/`,
                method: 'POST',
                body: { action }
            }),
            invalidatesTags: ['ActiveJobs']
        }),
    })
})

export const { useResponseToJobRequestMutation } = responseToJobRequestApi;