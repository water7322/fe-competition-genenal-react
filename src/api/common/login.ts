import instance from './instance';

// 登录参数
export interface LoginBody {}

// 登录返回值
export type LoginData = Record<string, any>;

// 登录注册
export const loginOrRegister = instance.post<LoginData, LoginBody>('/nccommon/login-or-register/do', {
    needUrlEncoded: true
});

// /nccommon/environment/config

// 其他地方登录检查
export const loginOtherPlace = instance.get<any>('/nccommon/token/login-other-place');

// 退出登录
export const logout = instance.post<any>('/nccommon/logout/do');

export interface LoginInfoData {
    openBigDay: string; // FIXME: 不知道干嘛的
    rsaPublicKey: string; // 公钥
}

// 获取帐号密码登录需要的信息
export const getLoginInfo = instance.get<LoginInfoData>('/nccommon/environment/config');

export interface LoginCaptchaQuery {
    source: 'netease' | 'gt';
}
export interface LoginCaptchaData {
    captchaId: string;
    challenge: string;
    success: boolean;
}

// 获取验证码需要的信息
export const getCaptchaConfig = instance.get<LoginCaptchaData, LoginCaptchaQuery>('/nccommon/captcha/geetest/login');

export interface ValidatePhoneBody {
    phone: string;
    netease_validate?: string;
}

// 获取验证码
export const validatePhone = instance.post<ValidatePhoneBody, any>('/nccommon/register/validate-phone-v2', {
    needUrlEncoded: true
});

export const validateEmail = instance.post<ValidatePhoneBody, any>('/nccommon/register/validate-email-v2', {
    needUrlEncoded: true
});

// 获取有验证码支持国家
export const getSMSSupportCountries = instance.get<{ code: string; name: string }[]>('/nccommon/helper/sms/supported_countries');

export const getOAuthState = instance.get<any>('/nccommon/register/oauthState');

// 登录模块相关状态码
export const enum LoginErrorCode {
    CAPTCHA_FAILED = 1125,
    /** 账号不存在 */
    ACCOUNT_NOT_EXIT = 1106,
    PASSWORD_INVALID = 1107,
    EMAIL_ADDRESS_INVALID = 1002,
    PHONE_CAPTCHA_ERROR = 1005,
    PHONE_CAPTCHA_INVALID = 1102,
    PHONE_INVALID = 1007,
    /** 未登录 */
    NOT_LOGGED_IN = 999
}
