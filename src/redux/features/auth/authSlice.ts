import { RootState } from '@/redux/store'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type TUser = {
    email: string;
    full_name: string | null;
    phone_number: string | null;
    role: "CUSTOMER" | "PROVIDER" | "ADMIN";
    is_verified: boolean;
    onboarding_status: string | null;
};

export type TAuthResponse = {
    refresh: string;
    access: string;
    user: TUser;
};

// Define a type for the slice state
interface IAuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: TUser | null;
}

// Define the initial state using that type
const initialState: IAuthState = {
    accessToken: null,
    refreshToken: null,
    user: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.accessToken = null
            state.refreshToken = null
        },
        setUser: (state, action: PayloadAction<TAuthResponse>) => {
            const { user, access, refresh } = action.payload
            state.user = user
            state.accessToken = access
            state.refreshToken = refresh
        },
    },
})

export const { logout, setUser } = authSlice.actions

export const selectAuth = (state: RootState) => state.auth
export const selectToken = (state: RootState) => state.auth.accessToken
export const selectUser = (state: RootState) => state.auth.user

export default authSlice.reducer