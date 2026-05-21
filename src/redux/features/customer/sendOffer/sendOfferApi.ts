import { baseApi } from "@/redux/api/baseApi";

const sendOfferApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendOffer: builder.mutation({
            query: ({ providerId, requestId }: { providerId: number; requestId: number }) => ({
                url: `/api/services/providers/${providerId}/invite/`,
                method: "POST",
                body: { request_id: requestId },
            }),
        }),
    }),
})

export const { useSendOfferMutation } = sendOfferApi;