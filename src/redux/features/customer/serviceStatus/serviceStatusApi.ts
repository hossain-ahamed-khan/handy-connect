import { baseApi } from "@/redux/api/baseApi";

const serviceStatusApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getServiceStatus: builder.query({
            query: (requestId: number) => ({
                url: `/api/services/requests/${requestId}/`,
                method: "GET",
            }),
        }),
    })
})

export const { useGetServiceStatusQuery } = serviceStatusApi;