import instance from './instance';

export interface Round {
    id: number;
    name: string;
    beginTime: number;
    endTime: number;
    status: number;
}

export interface Description {
    title: string;
    content: string;
}

export interface Limit {
    title: string;
    content: string;
}

export interface TrackIntro {
    description: Description;
    limit: Limit;
}

export interface Child {
    bg: string;
    children: string[];
}

export interface TrackPrize {
    title: string;
    children: Child[];
}

export interface Child2 {
    isText: boolean;
    content: string;
}

export interface TrackRule {
    title: string;
    children: Child2[];
}

export interface Config {
    trackIntro: TrackIntro;
    trackPrize: TrackPrize;
    trackRule: TrackRule;
}

export interface Track {
    id: number;
    title: string;
    signUpEndTime: number;
    buttonStatus: number;
    buttonLink: string;
    userSignUpStatus: number;
    rounds: Round[];
    config: Config;
    requirements: string;
}

export interface IGetTracksResponse {
    track: Track;
}

export interface IGetTracksPayload {
    contestId: number;
    trackId: number;
}

export const getTracks = instance.get<IGetTracksResponse, IGetTracksPayload>('/api/competition-platform/contest/v1/tracks');
