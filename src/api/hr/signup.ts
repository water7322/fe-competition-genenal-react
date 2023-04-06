import instance from './instance';
import type { UserSignupInfo } from './getSignupInfo';

export interface ISignupPayload {
    contestId: number;
    trackIds: number[];
    platform: string;
    userInfo: Partial<UserSignupInfo>;
}

export interface ISignupResponse {
    signUpStatus: 0 | 1;
}

export const signup = instance.post<ISignupResponse, ISignupPayload>('/api/competition-platform/contest/v1/sign-up');
