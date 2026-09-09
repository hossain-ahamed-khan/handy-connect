import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react"
import { RootState } from "../store"
import { logout, setCredentials } from "../features/auth/authSlice"

/** Singleflight lock so concurrent 401s share one refresh under ROTATE_REFRESH_TOKENS + blacklist. */
let refreshLock: Promise<void> | null = null

const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken
        if (token) {
            headers.set("Authorization", `Bearer ${token}`)
        }
        return headers
    },
})

type RefreshResponse = {
    access: string
    refresh?: string
}

const forceLogout = (
    api: Parameters<BaseQueryFn>[1],
    role: string | null | undefined,
) => {
    api.dispatch(logout())
    api.dispatch(baseApi.util.resetApiState())
    if (typeof window !== "undefined") {
        const path = role === "ADMIN" ? "/admin-login" : "/login"
        window.location.assign(path)
    }
}

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
        if (!refreshLock) {
            refreshLock = (async () => {
                const state = api.getState() as RootState
                const refresh = state.auth.refreshToken
                const role = state.auth.user?.role

                if (!refresh) {
                    forceLogout(api, role)
                    return
                }

                // Bare refresh — must not go through this reauth wrapper (avoids recursion).
                const refreshResult = await rawBaseQuery(
                    {
                        url: "/api/auth/refresh/",
                        method: "POST",
                        body: { refresh },
                    },
                    api,
                    extraOptions,
                )

                if (refreshResult.data) {
                    const data = refreshResult.data as RefreshResponse
                    api.dispatch(
                        setCredentials({
                            access: data.access,
                            ...(data.refresh ? { refresh: data.refresh } : {}),
                        }),
                    )
                } else {
                    forceLogout(api, role)
                }
            })().finally(() => {
                refreshLock = null
            })
        }

        await refreshLock

        const stillAuthed = Boolean((api.getState() as RootState).auth.accessToken)
        if (stillAuthed) {
            result = await rawBaseQuery(args, api, extraOptions)
        }
    }

    return result
}

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Profile", "ActiveJobs", "RequestedJobs"],
    endpoints: () => ({}),
})
