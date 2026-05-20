import { baseApi } from "@/redux/api/baseApi";

const initiateServiceRequestApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        initiateServiceRequest: builder.mutation({
            query: (serviceRequestInfo) => ({
                url: '/api/services/requests/initialize/',
                method: 'POST',
                body: serviceRequestInfo
            })
        }),
    })
})

export const { useInitiateServiceRequestMutation } = initiateServiceRequestApi;





const uploadMediaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        uploadMedia: builder.mutation({
            query: (mediaData) => ({
                url: '/api/services/media/upload/',
                method: 'POST',
                body: mediaData
            })
        }),
    })
})

export const { useUploadMediaMutation } = uploadMediaApi;





const finalRequestSubmissionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        finalRequestSubmission: builder.mutation({
            query: ({ requestId, formData }) => ({
                url: `/api/services/requests/${requestId}/`,
                method: 'PATCH',
                body: formData
            })
        }),
    })
})

export const { useFinalRequestSubmissionMutation } = finalRequestSubmissionApi;






const aiDiagonosisApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        aiDiagnosis: builder.query({
            query: ({ requestId }) => ({
                url: `/api/ai/result/${requestId}/`,
                method: 'GET',
            })
        }),
    })
})

export const { useAiDiagnosisQuery } = aiDiagonosisApi;