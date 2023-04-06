import instance from './instance';

export interface NewCareerJob {
    creatorId: number;
    id: number;
    level: number;
    name: string;
    parentId: number;
}

export interface HostAdditionInfo {
    careerJob: string;
    careerPreference: string;
    careerPreferenceDetail: string;
    clockDay: number;
    companyOvertime: number;
    companyScales: string;
    completeCareerInfo: number;
    eduLevel: string;
    job: string;
    lastTestTime: number;
    longUserId: number;
    lovedTags: string;
    openResumeToHr: number;
    resumeRight: number;
    schoolMajor: string;
    testKeepDay: number;
    type: number;
    userId: number;
    workStatusDetail: number;
    workTime: string;
    workWantPlace: string;
    yearSalaryMax: number;
    yearSalaryMin: number;
}

export interface CareerJob {
    creatorId: number;
    id: number;
    level: number;
    name: string;
    parentId: number;
}

export interface Identity {
    companyId: number;
    idenClass: string;
    level: number;
    name: string;
}

export interface Level1 {
    creatorId: number;
    id: number;
    level: number;
    name: string;
    parentId: number;
}

export interface Level3 {
    creatorId: number;
    id: number;
    level: number;
    name: string;
    parentId: number;
}

export interface Level2 {
    creatorId: number;
    id: number;
    level: number;
    name: string;
    parentId: number;
}

export interface NewJob {
    level1: Level1;
    level3: Level3;
    level2: Level2;
}

export interface Job {
    name: string;
    id: number;
}

export interface SelectedJob {
    parent: string;
    jobs: Job[];
    parentId: number;
}

export interface IGetUserInfoResponse {
    newCareerJobs: NewCareerJob[];
    isFollowedByHost: boolean;
    feedAdmin: boolean;
    onlyWrongCount: number;
    codingRightCount: number;
    type: number;
    resumeIsDone: boolean;
    discussCount: number;
    goodUgcScore: number;
    totalAnswerCount: number;
    honorScore: number;
    momentCount: number;
    totalWrongCount: number;
    headImg: string;
    boughtCourseCount: number;
    registerTime: number;
    followType: number;
    totalTestsCount: number;
    active: boolean;
    isBlacked: boolean;
    followProblemTotalCount: number;
    discussAdmin: boolean;
    phone: string;
    honorLevelName: string;
    moneyBalance: number;
    livePlace: string;
    referenceCount: number;
    likeAndFollowCount: number;
    followedCount: number;
    workStatusDetail: number;
    rawNickname: string;
    hostAdditionInfo: HostAdditionInfo;
    forbiddenUpdateName: number;
    headDecorateUrl: string;
    status: number;
    privacyPoliceContent: string;
    honorLevel: number;
    gender: string;
    careerJobs: CareerJob[];
    totalDiscussPost: number;
    clockCount: number;
    followingCount: number;
    workInfo: string;
    identity: Identity[];
    nickname: string;
    needAcceptPrivacyPolicy: boolean;
    honorLevelColor: string;
    additionInfoCompleteRateNum: number;
    newJobs: NewJob[];
    doneRightCount: number;
    jobs: string;
    followPostTotalCount: number;
    privacyPoliceTitle: string;
    likedCount: number;
    isAnonymousUser: boolean;
    userId: number;
    followPaperTotalCount: number;
    educationInfo: string;
    isCompleteInfo: boolean;
    workType: number;
    online: number;
    selectedJobs: SelectedJob[];
    infos: string;
}

export interface IGetUserInfoPayload {}

export const getUserInfo = instance.get<IGetUserInfoResponse, IGetUserInfoPayload>('/nccommon/profile/user-info-v2', { ncNotNeedLogin: true });
