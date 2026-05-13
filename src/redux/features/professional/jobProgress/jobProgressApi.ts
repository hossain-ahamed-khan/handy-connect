import { baseApi } from "@/redux/api/baseApi";

const jobProgressApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        jobOnTheWay: builder.mutation({
            query: ({ status, jobId }) => ({
                url: `/api/services/requests/${jobId}/advance-status/`,
                method: 'POST',
                body: { status }
            }),
            invalidatesTags: ['ActiveJobs']
        }),
        jobInProgress: builder.mutation({
            query: ({ status, jobId }) => ({
                url: `/api/services/requests/${jobId}/advance-status/`,
                method: 'POST',
                body: { status }
            }),
            invalidatesTags: ['ActiveJobs']
        }),
        jobComplete: builder.mutation({
            query: ({ formData, jobId }) => ({
                url: `/api/services/requests/${jobId}/submit-bill/`,
                method: 'POST',
                body: formData
            }),
            invalidatesTags: ['ActiveJobs']
        }),
    })
})

export const {
    useJobOnTheWayMutation,
    useJobInProgressMutation,
    useJobCompleteMutation
} = jobProgressApi;