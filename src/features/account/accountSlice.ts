import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import User from "../../app/models/User";
import jwtDecode from "jwt-decode";
import {RootState} from "../../app/store/store";

interface JwtPayload {
    "unique_name": string,
    "role": string,
    "user_name": string
    "nbf": number,
    "exp": number,
    "iat": number
}

export interface AccountState {
    id: string | null,
    role: number | null,
    name: string | null,
    token: string | null
}

const initialState: AccountState = {
    id: null,
    role: null,
    name: null,
    token: null,
}

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<string>)  => {
            const payload = jwtDecode<JwtPayload>(action.payload);
            state.id = payload.unique_name;
            state.role = parseInt(payload.role);
            state.name = payload.user_name;
            state.token = action.payload;
        },
        signOff: (state) => {
            state.id = null;
            state.role = null;
            state.name = null;
            state.token = null;
        },
    }
});

export const selectToken = (state: RootState) => state.account.token;
export const selectId = (state: RootState) => state.account.id;
export const selectRole = (state: RootState) => state.account.role;
export const selectName = (state: RootState) => state.account.name;

export const {login, signOff} = accountSlice.actions;