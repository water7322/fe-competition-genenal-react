import { loginOrRegister, logout, validatePhone, LoginErrorCode } from '@/api/common';
import { JSEncrypt } from 'jsencrypt';
import { useMessage } from '@/composable';
// import { useCaptchaModal, useMessage } from '@/composable';
// import { createEventHook } from '@vueuse/core';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const dispatch = useDispatch();
interface ValidatePhoneParams {
    phone: string;
    netease_validate?: string;
}
interface LoginWithCaptchaParams {
    account: string;
    captcha: string;
    remember: boolean;
}
interface LoginWithPasswordParams {
    account: string;
    password: string;
    netease_validate?: string;
    remember: boolean;
    publicKey: string;
}
interface LoginSuccessPayload {
    type: 'register' | 'login';
    way: 'captcha' | 'form';
}

interface LoginState {
    isLogin: boolean;
}
const initialState: LoginState = {
    isLogin: false
};

export const logoutAsync = createAsyncThunk('login/logout', async () => {
    try {
        await logout();
        useMessage().info('已退出登录');
        logoutHook.trigger(void 0);
        const { updateIsLogin } = loginSlice.actions;
        dispatch(updateIsLogin(false));
        return {
            isLogin: false
        };
    } catch (error) {
        useMessage().error('未知错误，请重试');
    }
});

export const validatePhoneAsync = createAsyncThunk('login/validatePhone', async (params: ValidatePhoneParams) => {
    try {
        const { phone, netease_validate } = params;

        const { error, code, msg } = await validatePhone({ body: { phone, netease_validate } });
        if (error) {
            switch (code) {
                case LoginErrorCode.CAPTCHA_FAILED:
                    const netease_validate = await useCaptchaModal();
                    await validatePhoneAsync({ ...params, netease_validate });

                    return;
                case LoginErrorCode.PHONE_INVALID:
                    useMessage().error('手机号码格式错误');
                    break;
                default:
                    useMessage().error(msg);
                    break;
            }

            return Promise.reject();
        } else {
            useMessage().success('验证码已发送，请注意查收');
        }
    } catch (error: any) {
        useMessage().error(error);
    }
});

export const loginWithCaptchaAsync = createAsyncThunk('login/loginWithCaptcha', async (params: LoginWithCaptchaParams, cb?: () => void) => {
    try {
        const { account, captcha, remember } = params;

        const { code, error, data, msg } = await loginOrRegister({
            body: { account, code: captcha, remember }
        });

        if (error) {
            switch (code) {
                case LoginErrorCode.ACCOUNT_NOT_EXIT:
                    useMessage().error('账号不存在');
                    break;
                case LoginErrorCode.PHONE_CAPTCHA_ERROR:
                case LoginErrorCode.PHONE_CAPTCHA_INVALID:
                    useMessage().error('验证码错误');
                    break;
                default:
                    useMessage().error(msg);
                    break;
            }

            return Promise.reject();
        } else {
            const { updateIsLogin } = loginSlice.actions;
            dispatch(updateIsLogin(true));
            cb?.();
            const payload: LoginSuccessPayload = {
                type: data.isLogin ? 'login' : 'register',
                way: 'captcha'
            };
            loginHook.trigger(payload);

            return payload;
        }
    } catch (error: any) {
        useMessage().error(error);
    }
});

export const loginWithPasswordAsync = createAsyncThunk('login/loginWithPassword', async (params: LoginWithPasswordParams, cb?: () => void) => {
    try {
        const { account, password, netease_validate, remember, publicKey } = params;

        const crypt = new JSEncrypt();
        crypt.setPublicKey(publicKey || '');
        const { code, error, data, msg } = await loginOrRegister({
            body: {
                account,
                cipherPwd: crypt.encrypt(password),
                remember,
                netease_validate
            }
        });

        if (error) {
            switch (code) {
                case LoginErrorCode.CAPTCHA_FAILED:
                    const netease_validate = await useCaptchaModal();
                    const payload: LoginSuccessPayload = await loginWithPasswordAsync({ ...params, netease_validate });

                    return payload;
                case LoginErrorCode.ACCOUNT_NOT_EXIT:
                    useMessage().error('账号不存在');
                    break;
                case LoginErrorCode.PASSWORD_INVALID:
                    useMessage().error('密码不正确，请重试');
                    break;
                case LoginErrorCode.EMAIL_ADDRESS_INVALID:
                    useMessage().error('邮箱地址错误');
                    break;
                default:
                    useMessage().error(msg);
                    break;
            }

            return Promise.reject();
        } else {
            const { updateIsLogin } = loginSlice.actions;
            dispatch(updateIsLogin(true));
            cb?.();
            const payload: LoginSuccessPayload = {
                type: data.isLogin ? 'login' : 'register',
                way: 'form'
            };
            loginHook.trigger(payload);

            return payload;
        }
    } catch (error: any) {
        useMessage().error(error);
    }
});

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        updateIsLogin: (state: LoginState, action: PayloadAction<boolean>) => {
            state.isLogin = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(logoutAsync.fulfilled, (state, action) => {})
            .addCase(validatePhoneAsync.fulfilled, (state, action) => {})
            .addCase(loginWithCaptchaAsync.fulfilled, (state, action) => {});
    }
});

export default loginSlice;
