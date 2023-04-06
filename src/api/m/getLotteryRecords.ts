import instance from './instance';

export interface LotteryRecords {
    head: string; // 用户头像
    name: string; // 用户名字
    time: number; // 中奖时间
    awardName: string; // 奖品名字
}

export interface IGetLotteryRecordsResponse {
    msg: string;
    code: number;
    data: Array<LotteryRecords>;
}
export interface IGetLotteryRecordsPayload {
    activityId: number;
    page: number;
}

export const getLotteryRecords = instance.get<LotteryRecords[], IGetLotteryRecordsPayload>('/lottery/records');
