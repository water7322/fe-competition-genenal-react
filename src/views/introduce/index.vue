<!-- 
大赛介绍页面
 -->

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import Time from '@ncfe/nc.time';
import { SignUp, TimeLine, TrackIntro, TrackPrize, TrackRule, Lottery, Tab, Requirements } from './components';
import { AcmGio } from '@@/gio';
import type { ITimeLineItem } from '@/interface';
import Section from '@/components/Section.vue';
import { getIntroduceConfig, getTracks } from '@@/api/hr';
import type { Description, Limit, IGetIntroduceConfigResponse } from '@@/api/hr';
import { useAppConfig, useLogin } from '@@/store';
import { useRouterEventHook } from '@@/composable';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

const route = useRoute();
const { onLogout } = useLogin();
const { contestId } = useAppConfig();
const { appConfig, trackInfo } = storeToRefs(useAppConfig());
const { onRouteChange } = useRouterEventHook();
onRouteChange('hash', ({ route }) => {
    if ((route.name = 'introduce')) {
        refresh();
    }
});
onLogout(() => {
    refresh();
});
// 等待赛道排序完，在调一次接口
watch(
    trackInfo,
    () => {
        refresh();
    },
    {
        immediate: true
    }
);
// 介绍配置
const trackIntro = ref<{
    description: Description;
    limit: Limit;
}>();
// 奖项配置
const trackPrize = ref({});
// 规则配置
const trackRule = ref({});

// 赛道要求
const requirements = ref('');

// 报名截止时间
const endTime = ref(0);
// 时间线
const timeLineList = ref<Array<ITimeLineItem>>([]);

// 浏览开始时间
const nowTime = ref(0);

const buttonStatus = ref(0);
const buttonLink = ref('');
const userSignUpStatus = ref(0);

const introduceConfig = ref<IGetIntroduceConfigResponse>();
async function fGetIntroduceConfig() {
    const res = await getIntroduceConfig({
        query: {
            contestId
        }
    });
    const data = res.data || {};
    if (res.error || !res.data) {
        return;
    }
    introduceConfig.value = data;
}
async function refresh() {
    const res = await getTracks({
        query: {
            contestId,
            trackId: +route.hash.split('#')[1] || trackInfo.value.sortedTracks[0].value
        }
    });
    const data = res.data || {};
    if (res.error || !res.data) {
        return;
    }
    trackInfo.value.track = data.track;
    timeLineList.value = data.track.rounds.map((item: any) => {
        return {
            timestamp: Time.form(new Date(item.beginTime), 'MM.dd HH:mm'),
            ...item
        };
    });
    requirements.value = data.track?.requirements ?? '';
    trackIntro.value = data.track?.config?.trackIntro ?? {};
    trackPrize.value = data.track?.config?.trackPrize ?? {};
    trackRule.value = data.track?.config?.trackRule ?? {};
    endTime.value = data.track?.signUpEndTime;

    buttonStatus.value = data.track?.buttonStatus;
    buttonLink.value = data.track?.buttonLink;
    userSignUpStatus.value = data.track?.userSignUpStatus;
}

onMounted(() => {
    fGetIntroduceConfig();
    nowTime.value = Date.now();
});
onBeforeUnmount(() => {
    // AcmGio.contestPageView({
    //     platForm_var: 'pc',
    //     contestID_var: contestId,
    //     contestName_var: appConfig.value?.contestName,
    //     TimeView_var: ((Date.now() - nowTime.value) / 1000).toFixed(1)
    // });
});
</script>

<template>
    <div>
        <div v-if="introduceConfig" class="tw-text-[#5d5d5d] tw-leading-[25px] tw-whitespace-pre-wrap" v-html="introduceConfig.content"></div>
        <Tab v-if="trackInfo.sortedTracks.length > 1" class="tw-mt-7" />
        <Section title="赛道详情" class="tw-p-6 tw-mt-7">
            <div class="tw-pb-10">
                <Requirements v-if="requirements" :requirements="requirements" />
                <!-- 参赛 -->
                <SignUp :end-time="endTime" :button-status="buttonStatus" :button-link="buttonLink" :user-sign-up-status="userSignUpStatus" @refresh="refresh" />
                <!-- 时间轴 -->
                <TimeLine v-if="timeLineList && timeLineList.length > 0" class="tw-mt-5" :time-line-list="timeLineList" @refresh="refresh" />
            </div>
            <!-- 赛道介绍 -->
            <TrackIntro v-if="trackIntro && Object.keys(trackIntro).length > 0" class="track-intro" :description="trackIntro.description" :limit="trackIntro.limit" />
            <!-- 奖励 -->
            <TrackPrize v-if="Object.keys(trackPrize).length > 0" :intro="trackPrize" />
            <!-- 比赛规则 -->
            <TrackRule v-if="Object.keys(trackRule).length > 0" class="tw-mt-3" :intro="trackRule" />
        </Section>

        <Lottery v-if="appConfig?.lotteryConf.enable && introduceConfig" :introduce-config-lottery="introduceConfig.lottery" class="tw-mt-9" />
    </div>
</template>

<style lang="scss" scoped>
.track-intro {
    padding-top: 34px;
}
</style>
