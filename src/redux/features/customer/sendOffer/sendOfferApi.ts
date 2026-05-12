import { baseApi } from "@/redux/api/baseApi";

const sendOfferApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendOffer: builder.mutation({
            query: ({ requestId, formData }) => ({
                url: `/api/services/requests/${requestId}/send-offer/`,
                method: 'POST',
                body: formData
            })
        })
    })
})

export const { useSendOfferMutation } = sendOfferApi;