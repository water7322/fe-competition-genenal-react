import instance from './instance';

export interface IGetAboutConfigResponse {
    name: string;
    content: string;
}

export interface IGetAboutConfigPayload {
    contestId: number;
}

export const getAboutConfig = instance.get<IGetAboutConfigResponse, IGetAboutConfigPayload>('/api/competition-platform/contest/v1/config/about');
