import { baseApi } from "@/redux/api/baseApi";

const jobProgressApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        jobOnTheWay: builder.mutation({
            query: ({status, jobId}) => ({
                url: `/api/services/requests/${jobId}/advance-status/`,
                method: 'POST',
                body: { status }
            }),
            revalidateTags: ['ActiveJobs']
        }),
        jobInProgress: builder.mutation({
            query: ({status, jobId}) => ({
                url: `/api/services/requests/${jobId}/advance-status/`,
                method: 'POST',
                body: { status }
            }),
            revalidateTags: ['ActiveJobs']
        }),
        jobComplete: builder.mutation({
            query: ({formData, jobId}) => ({
                url: `/api/services/requests/${jobId}/submit-bill/`,
                method: 'POST',
                body: formData
            }),
            revalidateTags: ['ActiveJobs']
        }),
    })
})

export const {
    useJobOnTheWayMutation,
    useJobInProgressMutation,
    useJobCompleteMutation
} = jobProgressApi;