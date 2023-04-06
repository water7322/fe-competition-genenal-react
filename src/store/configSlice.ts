import { isMobile, deviceType } from 'mobile-device-detect';
import { useParams } from 'react-router-dom';
import { getAppConfig } from '@/api/hr';
import type { IGetAppConfigResponse } from '@/api/hr';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import { useMessage } from '@/composable';

type DeviceType = 'browser' | 'mobile' | 'tablet' | 'smarttv' | 'wearable' | 'console';

interface UserDeviceInfo {
    isMobile: boolean;
    type: DeviceType;
}
interface TrackItem {
    label: string;
    value: number;
}
export interface TrackInfo {
    track: {};
    sortedTracks: TrackItem[];
    enableSignupTracks: {
        id: number;
        name: string;
        signUpStatus: 0 | 1;
    }[];
}
interface ConfigState {
    device?: UserDeviceInfo;
    contestId: number;
    appConfig?: IGetAppConfigResponse | null;
    themeColor?: string | undefined;
    isDataReady?: boolean;
    enableSignup?: boolean;
    trackInfo?: TrackInfo | null;
}
const initialState: ConfigState = {
    device: { isMobile, type: deviceType as DeviceType },
    contestId: 4,
    appConfig: null,
    themeColor: '',
    isDataReady: false,
    enableSignup: false,
    trackInfo: null
};

export const updateAppConfigAsync = createAsyncThunk('config/getAppConfig', async () => {
    try {
        const { error, data, code } = await getAppConfig({
            query: {
                contestId: initialState.contestId
            }
        });
        if (!error) {
            const appConfig = data;
            const trackInfo = getTrackInfo(appConfig);
            return {
                appConfig,
                themeColor: appConfig.otherConf.theme.color,
                isDataReady: true,
                enableSignup: trackInfo.enableSignupTracks.length > 0,
                trackInfo
            };
        }
    } catch (e: any) {
        useMessage().error(e);
    }
});

export const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(updateAppConfigAsync.fulfilled, (state, action) => {
            state.appConfig = action.payload?.appConfig;
            state.themeColor = action.payload?.themeColor;
            state.isDataReady = action.payload?.isDataReady;
            state.enableSignup = action.payload?.enableSignup;
            state.trackInfo = action.payload?.trackInfo;
        });
    }
});

function getTrackInfo(appConfig: IGetAppConfigResponse) {
    const { signupData } = userSlice.getInitialState();
    const tracks = appConfig.trackConf.tracks.map(({ id, name }) => ({ label: name, value: id }));
    const signupArr: TrackItem[] = [];
    const hashArr: TrackItem[] = [];
    const unsignupArr: TrackItem[] = [];

    if (signupData?.trackIds.length) {
        for (const item of tracks || []) {
            if (signupData?.trackIds.includes(item.value)) {
                signupArr.push(item);
            } else {
                unsignupArr.push(item);
            }
        }
    } else {
        const id = +window.location.hash.split('#')[1];
        for (const item of tracks || []) {
            if (item.value === id) {
                hashArr.push(item);
            } else {
                unsignupArr.push(item);
            }
        }
    }

    return {
        track: {},
        sortedTracks: [...signupArr, ...hashArr, ...unsignupArr],
        enableSignupTracks: appConfig.trackConf.tracks.filter(track => !!track.signUpStatus) ?? []
    };
}

export default configSlice;
