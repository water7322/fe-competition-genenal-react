/**
 * 弹幕轨道
 */
export type DanChannel = Record<number, [HTMLDivElement]>;

/**
 * 弹幕元素属性
 */
export interface DanmuItem {
    height: number;
    fontSize: number;
    speeds: number;
    top: number;
    right: number;
}

/**
 * 弹幕库属性
 */
export interface DanmakuItem {
    channels: number;
    loop: boolean;
    debounce: number;
    useSlot: boolean;
}
/**
 * 自定义弹幕
 */
export type CustomDanmu = Record<string, any>;

/**
 * 弹幕类型
 */
export type Danmu = string | CustomDanmu;

export enum SignUpStatus {
    NOT_BEGIN = 0, // 报名未开始
    SIGNING = 1, // 报名进行中
    SIGN_END = 2, // 报名结束
    SIGN_SUCCESS = 2, // 报名成功
    SIGN_FAILURE = 3 // 报名失败
}

export enum TrackStatus {
    // 开赛状态
    TRACK_NOT_BEGIN = 0, // 比赛未开始
    TRACKING = 1, // 比赛进行中
    TRACK_END = 2 // 比赛结束
}

export interface IRouteItem {
    name: string;
    path: string;
    isHide?: boolean;
}

/** 赛道配置 */
export interface ITrack {
    /** 赛道名称 */
    title: string;
    /** 标题颜色 */
    titleColor?: string;
    /** 简介 */
    content: string;
    /** ?? */
    subContent: string;
    /** 字体颜色 */
    fontColor: string;
    /** 背景图片 */
    background: string;
}
export interface IPrize {
    /** 背景图片 */
    bg: string;
    /** 奖励内容 */
    children: string[];
}

/** 规则 */
export interface IRule {
    /** ?? */
    isText: boolean;
    /** 规则 */
    content: string;
}
export interface IAppIntro {
    /** app定制标记 */
    type: number;
    /** app主题配置 */
    theme: string;
    /** 是否显示抽奖模块 */
    isLottery: boolean;
    /** 菜单 */
    routes: Array<IRouteItem>;
    /** 暂未使用 */
    tabStyle?: any;
    /** header定制信息 */
    header: {
        /** 背景图片 */
        bg?: string;
        /** 背景颜色 */
        color?: string;
    };
    /** 介绍页配置  */
    introduce: {
        /** 赛道介绍 */
        trackIntro: {
            /** 名称 */
            title: string;
            /** 简介 */
            content: string;
            /** 赛道 */
            children: ITrack[];
        };
        /** 赛道奖励 */
        trackPrize: {
            /** 名称 */
            title: string;
            /** 奖励 */
            children: IPrize[];
        };
        /** 大赛规则 */
        trackRule: {
            /** 名称 */
            title: string;
            /** 规则 */
            children: IRule[];
        };
        trackPointPrize?: any;
    };
    rank: any;
    faq: any;
    about: any;
    footer: any;
    sign: any;
}

export interface IRankItem {
    tracks: string[];
    channels: any[];
    content: string;
    [key: string]: any;
}

export interface ITimeLineItem {
    things: string;
    timestamp: string;
    time: number;
    status: number;
    trackLink: string;
    [key: string]: any;
}

export enum TimelineStatus {
    PAST = 0,
    TRACK = 1,
    FUTURE = 2
}

/**
 * type = 1 多校，也代表团体赛
 * type =2 民生， 也代表个人赛
 */
export enum TYPE {
    TEAM_RACE = 1,
    PERSON_RACE = 2,
    HUATAI_RACE = 3
}

// sign-up action值
export enum Actions {
    EDITOR,
    SIGN_UP
}
