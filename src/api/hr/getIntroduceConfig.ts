import instance from './instance';

export interface IGetIntroduceConfigResponse {
    content: string;
    lottery: {
        title: string;
        children: { bg: string; content: string }[];
    };
}

export interface IGetIntroduceConfigPayload {}

export const getIntroduceConfig = instance.get<IGetIntroduceConfigResponse, IGetIntroduceConfigPayload>('/api/competition-platform/contest/v1/config/introduce');
