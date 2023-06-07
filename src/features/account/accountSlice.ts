import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import User from "../../app/models/User";
import jwtDecode from "jwt-decode";
import {RootState} from "../../app/store/store";

interface JwtPayload {
    "unique_name": string,
    "role": string,
    "nbf": number,
    "exp": number,
    "iat": number
}

export interface AccountState {
    user: User
    token: string | null
}

const initialState: AccountState = {
    user: {},
    token: null,
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<string>)  => {
            const payload = jwtDecode<JwtPayload>(action.payload);
            state.user.name = payload.unique_name;
            state.user.role = parseInt(payload.role);
            state.token = action.payload;
        },
        signOff: (state) => {
            state.user = {};
            state.token = null;
        },
    }
});

export const selectToken = (state: RootState) => state.account.token;
export const selectUser = (state: RootState) => state.account.user;

export const {login, signOff} = accountSlice.actions;