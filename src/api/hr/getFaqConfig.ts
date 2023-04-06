import instance from './instance';

export interface IGetFaqConfigResponse {
    qa: {
        title: string;
        children: { title: string; answer: string }[];
    };
    contact: {
        title: string;
        children: {
            image: string;
            content: string;
            number: number;
        }[];
    };
}

export interface IGetFaqConfigPayload {
    contestId: number;
}

export const getFaqConfig = instance.get<IGetFaqConfigResponse, IGetFaqConfigPayload>('/api/competition-platform/contest/v1/config/faq');
