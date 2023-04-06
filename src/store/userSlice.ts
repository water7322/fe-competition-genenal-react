import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserInfo, LoginErrorCode } from '@/api/common';
import { getSignupInfo } from '@/api/hr';
import type { IGetUserInfoResponse } from '@/api/common';
import type { IGetSignupResponse } from '@/api/hr';
// import { useDispatch } from 'react-redux';
// import loginSlice from './loginSlice';
import { configSlice } from './configSlice';
import { useMessage } from '@/composable';
// const dispatch = useDispatch();
interface UserState {
    userData?: IGetUserInfoResponse;
    signupData?: IGetSignupResponse;
    isSignup?: boolean;
}
const initialState: UserState = {
    userData: undefined,
    signupData: undefined,
    isSignup: false
};

export const updateUserInfoAsync = createAsyncThunk('user/getUserInfo', async () => {
    try {
        // const { updateIsLogin } = loginSlice.actions;
        const { contestId } = configSlice.getInitialState();
        const { error, data, code } = await getUserInfo();
        let userData, signupData, isSignup;
        if (error || code === LoginErrorCode.NOT_LOGGED_IN) {
            // dispatch(updateIsLogin(false));
        } else {
            // dispatch(updateIsLogin(true));
            userData = data;
            // 登录成功之后获取报名状态
            const result = await getSignupInfo({ query: { contestId } });
            if (result.data) {
                signupData.value = result.data;
                isSignup.value = !!result.data.signUpStatus;
            }
        }
        return {
            userData,
            signupData,
            isSignup
        };
    } catch (e: any) {
        useMessage().error(e);
    }
});

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(updateUserInfoAsync.fulfilled, (state, action) => {
            state.userData = action.payload?.userData;
            state.signupData = action.payload?.signupData;
            state.isSignup = action.payload?.isSignup;
        });
    }
});

export default userSlice;
