<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useLoginModal } from '@/composable';
import { useRouterEventHook } from '@@/composable';
import { useLogin, useUser, useAppConfig } from '@@/store';
import { McTabs, McTab, McPopselect, McPopover, McIcon } from 'meetcode-ui';
import { Power } from '@vicons/ionicons5';
import type { TabPaneName } from 'meetcode-ui';
import { AcmGio } from '@@/gio';
import type { Track } from '@@/api/hr';

const router = useRouter();
const route = useRoute();
const name = route.name;
const { onRouteChange } = useRouterEventHook();
const { logout } = useLogin();
const { isLogin } = storeToRefs(useLogin());
const { isSignup, userData } = storeToRefs(useUser());
const { contestId } = useAppConfig();
const { appConfig, themeColor, trackInfo } = storeToRefs(useAppConfig());
const currentTab = ref(name === 'sign' ? 'introduce' : (name as string));
const contestTrack = ref(trackInfo.value.sortedTracks[0].value);
const enableSignup = computed(() => {
    return !appConfig.value?.trackConf.tracks.every(({ signUpStatus }) => !!!signUpStatus);
});
const tabs = computed(() => {
    return appConfig.value?.otherConf.tab.filter(tab => tab.type !== 'introduce');
});

const handleBeforeTabSwitch = (from: TabPaneName, to: TabPaneName) => {
    if (to === 'track') return false;
};
const handleTabClick = (tab: string) => {
    if (tab === 'introduce' || tab === 'track') {
        router.push({ path: `introduce`, hash: `#${contestTrack.value}`, query: route.query });
    } else {
        router.push({ path: tab, query: route.query });
    }
};
const handleSelectTrack = (name: string) => {
    AcmGio.contestTrackClick({
        platForm_var: 'pc',
        channel_var: route.query.channel,
        contestID_var: contestId,
        contestName_var: appConfig.value?.contestName,
        contestApplyTrack_var: name
    });
    router.push({ path: `introduce`, hash: `#${name}`, query: route.query });
};
const handleSignup = () => {
    router.push({ path: 'sign', query: route.query });
};
const handleLogin = () => {
    if (isSignup.value || !enableSignup.value) return;
    AcmGio.contestApplyClick({
        platForm_var: 'pc',
        channel_var: route.query.channel,
        contestID_var: contestId,
        contestName_var: appConfig.value?.contestName,
        contestApplyTrack_var: route.hash ? +route.hash.slice(1) : trackInfo.value.sortedTracks[0].value
    });
    const track = trackInfo.value.track as Track;
    const buttonLink = track.buttonLink;

    if (buttonLink.startsWith('http')) {
        window.open(buttonLink);
        return;
    }
    if (!isLogin.value) {
        useLoginModal();
        return;
    }
    if (buttonLink === '') {
        return;
    }
    router.push({ path: 'sign', query: route.query });
};
const handleLoginRegister = () => {
    const track = trackInfo.value.track as Track;
    const buttonLink = track.buttonLink;
    if (buttonLink.startsWith('http')) {
        AcmGio.contestApplyClick({
            platForm_var: 'pc',
            channel_var: route.query.channel,
            contestID_var: contestId,
            contestName_var: appConfig.value?.contestName,
            contestApplyTrack_var: route.hash ? +route.hash.slice(1) : trackInfo.value.sortedTracks[0].value
        });
        const track = trackInfo.value.track as Track;
        const buttonLink = track.buttonLink;
        window.open(buttonLink);
        return;
    }
    useLoginModal();
};

onRouteChange('path', ({ route }) => {
    currentTab.value = route.name as string;
});
onRouteChange('hash', ({ hash }) => {
    contestTrack.value = hash ? +hash.slice(1) : trackInfo.value.sortedTracks[0].value;
});
</script>

<template>
    <header class="tw-flex tw-justify-center tw-fixed tw-top-0 tw-w-full tw-bg-white tw-z-50">
        <div class="tw-flex tw-items-center tw-justify-between tw-w-[1000px]">
            <div class="tw-flex tw-items-center">
                <img :src="appConfig?.otherConf.header.logo" class="tw-h-5" />
                <McTabs
                    v-model:value="currentTab"
                    :header-style="{ height: '56px' }"
                    :content-style="{ padding: 0 }"
                    header-class="menu-tab"
                    :active-color="themeColor"
                    :tab-gap="0"
                    :show-line="false"
                    @before-tab-switch="handleBeforeTabSwitch"
                    @tab-click="handleTabClick"
                >
                    <McTab name="introduce">大赛介绍</McTab>
                    <McTab v-if="trackInfo.sortedTracks.length > 1" name="track">
                        <McPopselect
                            v-model:value="contestTrack"
                            style="border-radius: 8px; width: 118px"
                            :options="trackInfo.sortedTracks"
                            :item-style="{ lineHeight: 1, fontSize: '12px' }"
                            :item-height="32"
                            :with-arrow="false"
                            :offset="{ top: '16px' }"
                            :hide-delay="200"
                            @select="handleSelectTrack"
                        >
                            赛道选择
                        </McPopselect>
                    </McTab>
                    <McTab v-for="tab of tabs" :key="tab.type" :name="tab.type">{{ tab.name }}</McTab>
                </McTabs>
            </div>
            <div class="tw-flex tw-items-center tw-h-full">
                <span v-if="isSignup && enableSignup" class="tw-cursor-pointer" @click="handleSignup">修改报名信息</span>
                <div class="signup-btn tw-text-white tw-ml-5 tw-h-full tw-px-5 tw-py-[17px] tw-box-border tw-cursor-pointer tw-mr-8" :class="{ disabled: !enableSignup }" @click="handleLogin">
                    {{ enableSignup ? (isSignup ? '报名成功' : '立即报名') : '报名结束' }}
                </div>
                <div v-if="!isLogin" class="tw-text-white tw-rounded-lg tw-text-center tw-leading-[16px] tw-cursor-pointer" style="background: var(--theme-color); width: 95px; padding: 10px 0" @click="handleLoginRegister">登录 / 注册</div>
                <McPopover v-else-if="userData" :with-arrow="false" style="padding: 4px; width: 150px">
                    <div class="tw-flex tw-items-center tw-cursor-pointer">
                        <img class="tw-h-10 tw-w-10 tw-rounded-full tw-mr-3" :src="userData.headImg" alt="" />
                        {{ userData.nickname }}
                    </div>
                    <template #content>
                        <div class="tw-leading-8 tw-px-2 tw-truncate">{{ userData.nickname }}</div>
                        <div class="header-logout-btn tw-leading-8 tw-flex tw-items-center tw-cursor-pointer tw-px-2 tw-rounded" @click="logout">
                            <McIcon class="tw-mr-2" :icon="Power" :size="16" />
                            退出登录
                        </div>
                    </template>
                </McPopover>
            </div>
        </div>
    </header>
</template>

<style lang="scss">
.menu-tab {
    .mc-tabs-tab {
        padding: 17px 20px !important;
    }
    .mc-tabs-tab--active {
        font-weight: 500;
    }
}

.header-logout-btn:hover {
    transition: 0.2s;
    background: #f2fcf8;
}
</style>

<style lang="scss" scoped>
.signup-btn {
    background: var(--theme-color);
    &.disabled {
        @apply tw-bg-gray-300 tw-cursor-not-allowed;
    }
}
</style>
