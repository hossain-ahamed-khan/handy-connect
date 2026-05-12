import { baseApi } from "@/redux/api/baseApi";

export type MyRequest = {
    id: number;
    service_name: string;
    service_icon: "water_drop" | "palette" | "bolt" | string;
    display_text: string;
    status: "PENDING" | "DIAGNOSING" | "COMPLETE" | string;
};

const myRequestListApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyRequestList: builder.query<MyRequest[], void>({
            query: () => ({
                url: "/api/services/recent-requests/",
                method: "GET",
            }),
        }),
    }),
});

export const { useGetMyRequestListQuery } = myRequestListApi;