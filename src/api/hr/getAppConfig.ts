import instance from './instance';

export interface LotteryConf {
    enable: boolean;
    lotteryId: number;
}

export interface TrackConf {
    tracks: {
        id: number;
        name: string;
        signUpStatus: 0 | 1;
    }[];
}

export interface Field {
    name: string;
    type: string;
}

export interface RankConf {
    tracks: {
        id: number;
        name: string;
        rounds: {
            id: number;
            name: string;
            fields: Field[];
            content: string;
            emptyRankContent: string;
        }[];
    }[];
}

export interface Field2 {
    name: string;
    type: string;
}

export interface SignUpConf {
    fields: Field2[];
    content: string;
}

export interface Tab {
    name: string;
    type: string;
}

export interface Theme {
    color: string;
}

export interface TabStyle {
    bg: string;
    activeColor: string;
    inactiveColor: string;
}

export interface Header {
    bg: string;
    logo: string;
}

export interface Footer {
    bg: string;
    leftIcon: string;
    rightIcon: string;
}

export interface OtherConf {
    tab: Tab[];
    theme: Theme;
    tabStyle: TabStyle;
    header: Header;
    footer: Footer;
}

export interface IGetAppConfigResponse {
    contestName: string;
    lotteryConf: LotteryConf;
    trackConf: TrackConf;
    rankConf: RankConf;
    signUpConf: SignUpConf;
    otherConf: OtherConf;
}

export interface IGetAppConfigPayload {
    contestId: number;
}

export const getAppConfig = instance.get<IGetAppConfigResponse, IGetAppConfigPayload>('/api/competition-platform/contest/v1/config');
