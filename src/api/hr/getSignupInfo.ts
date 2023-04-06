import instance from './instance';

export interface UserSignupInfo extends Record<string, unknown> {
    MDSchool: string;
    eduLevel: string | number;
    idCard: string;
    workTime: string | number | null;
    major: string;
    school: string;
    phone: string;
    email: string;
    realName: string;
}

export interface IGetSignupPayload {
    contestId: number;
}

export interface IGetSignupResponse {
    contestId: number;
    platform: 'pc' | 'h5';
    userInfo: Partial<UserSignupInfo>;
    signUpStatus: 0 | 1;
    trackIds: number[];
}

export const getSignupInfo = instance.get<IGetSignupResponse, IGetSignupPayload>('/api/competition-platform/contest/v1/sign-up-info');
