import ENV from '@@/env.json';

export const RegisterProtocol = 'https://static.nowcoder.com/protocol/register.html';
export const PrivacyPolicy = 'https://static.nowcoder.com/protocol/privacy-policy.html';
export const ForgotPassword = `${ENV[process.env.NODE_ENV || 'development'].WWW}/forgot-pwd`;
