import instance from './instance';

export interface IGetRankPayload {
    contestId: number;
    trackId: number;
    roundId: number;
    page: number;
    pageSize: number;
}

export interface IGetRankResponse {
    totalCount: number;
    totalPage: number;
    pageSize: number;
    currentPage: number;
    data: string[][];
}
export const getRank = instance.get<IGetRankResponse, IGetRankPayload>('/api/competition-platform/contest/v1/rank');
