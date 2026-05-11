import { baseApi } from "@/redux/api/baseApi";

const notificationsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: () => ({
                url: '/api/services/notifications/',
                method: 'GET',
            })
        }),
    })
})

export const { useGetNotificationsQuery } = notificationsApi;