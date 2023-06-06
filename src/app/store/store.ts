import { configureStore } from '@reduxjs/toolkit';
import { accountSlice } from "../../features/account/accountSlice";

export const store = configureStore({
    reducer: {
        account: accountSlice.reducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;