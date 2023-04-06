<script setup lang="ts">
import { onMounted, toRefs, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import CountDown from './CountDown.vue';
import { AcmGio } from '@@/gio';
import { useLogin } from '@@/store';
import { useLoginModal } from '@/composable';
import { useAppConfig } from '@@/store';
const { contestId } = useAppConfig();
const { appConfig, trackInfo } = storeToRefs(useAppConfig());

const props = defineProps({
    endTime: {
        type: [Number, String],
        required: true
    },
    buttonStatus: {
        type: Number,
        default: 0
    },
    buttonLink: {
        type: String,
        default: ''
    },
    userSignUpStatus: {
        type: Number,
        default: 0
    }
});
const { endTime, buttonStatus, buttonLink, userSignUpStatus } = toRefs(props);
const SIGN_STATUS: { [key: string]: string } = {
    0: '暂未开赛',
    1: '立即报名',
    2: '报名成功',
    3: '即将开赛',
    4: '进入比赛',
    5: '等待排名',
    6: '查看排名',
    7: '比赛结束'
};

const { isLogin } = storeToRefs(useLogin());
const router = useRouter();
const route = useRoute();
const emits = defineEmits(['refresh']);

const canEditMemberInfo = ref(false); // 展示修改报名信息入口

const actionSignUp = () => {
    if (buttonStatus.value === 1) {
        AcmGio.contestApplyClick({
            platForm_var: 'pc',
            channel_var: route.query.channel,
            contestID_var: contestId,
            contestName_var: appConfig.value?.contestName,
            contestApplyTrack_var: route.hash ? +route.hash.slice(1) : trackInfo.value.sortedTracks[0].value
        });
    }
    if (buttonLink.value.startsWith('http')) {
        window.open(buttonLink.value);
        return;
    }
    if (!isLogin.value) {
        useLoginModal();
        return;
    }
    if (buttonLink.value === '') {
        return;
    }
    if (buttonStatus.value === 4) {
        window.open(buttonLink.value);
        return;
    }
    // if (buttonLink.value === 'rank') {
    //     AcmGio.contestTabClick({
    //         platForm_var: 'pc',
    //         contestID_var: contestId,
    //         contestName_var: appConfig.value?.contestName,
    //         contestTabName_var: '排行榜'
    //     });
    // }
    router.push({
        path: `/${contestId}/${buttonLink.value}`,
        query: route.query
    });
};

const editorInntro = () => {
    router.push({
        path: 'sign',
        query: route.query
    });
};

onMounted(() => {});
</script>
<template>
    <div v-if="buttonStatus === 2" class="change-intro tw-text-right tw-mb-5 tw-mr-10" @click="editorInntro">修改报名信息</div>
    <div class="tw-flex tw-items-center">
        <div class="count-down-container">
            <count-down v-slot="timeObj" :end="endTime" class="count-down" @refresh="emits('refresh')">
                <span>报名截止倒计时</span>
                <span class="count-down-strong">{{ timeObj.dd }}</span> 天 <span class="count-down-strong">{{ timeObj.hh }}</span> 时 <span class="count-down-strong">{{ timeObj.mm }}</span> 分 <span class="count-down-strong">{{ timeObj.ss }}</span> 秒
            </count-down>
        </div>
        <div class="sign-up">
            <div class="sign-up-btn sign-up" :class="{ 'sign-up-ok': buttonStatus === 4 && userSignUpStatus === 0, 'sign-up-cursor-default': [0, 2, 3, 5, 7].includes(buttonStatus) }" @click="actionSignUp">
                {{ SIGN_STATUS[buttonStatus] }}
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
$font-24: 24px;
$font-26: 26px;
$font-36: 36px;
$font-strong: #535353;
$font-sub: #5d5d5d;
$colorBlue: var(--basis-color); // 蓝色字体
$colorBlack: #150a0a; // 黑色字体
.count-down-container {
    .count-down {
        margin-left: 30px;
        margin-top: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 22px;
        color: #3b3b3b;
        &-strong {
            width: 35px;
            font-size: 32px;
            line-height: 35px;
            font-family: D-DIN-Bold;
            font-weight: bold;
            margin-left: 12px;
            color: $font-strong;
        }
    }
}
.change-intro {
    font-size: 14px;
    color: $font-sub;
    position: relative;
    cursor: pointer;
    white-space: nowrap;
    &::after {
        content: '';
        height: 7px;
        width: 7px;
        top: 50%;
        position: absolute;
        border-left: 1px solid $font-sub;
        border-bottom: 1px solid $font-sub;
        transform: translate(0, -50%) rotate(-135deg);
    }
}
.sign-up {
    flex: 1;
    min-width: 200px;
    text-align: right;
    padding-right: 26px;
    overflow: hidden;
    .sign-up-btn {
        float: right;
        width: 198px;
        padding: 10px;
        border-radius: 9px;
        filter: blur(0px);
        text-align: center;
        font-size: 30px;
        font-weight: 500;
        color: white;
        line-height: 40px;
        box-sizing: border-box;
        cursor: pointer;
        // border: 1px solid;
    }
    .sign-up {
        background: var(--theme-color);
        // TODO 颜色需要标准化，比如按主色的50%
        // background: linear-gradient(270deg, var(--tab-bg-from), var(--tab-bg-to));
        // box-shadow: 0px 9px 15px 0px rgba(0, 201, 120, 0.16), inset 0px 1px 5px 0px rgba(20, 144, 101, 0.6);
        // border-image: linear-gradient(180deg, var(--tab-bg-from), rar(--tab-bg-from)) 1 1;
    }
    .sign-up-ok {
        cursor: default;
        background: linear-gradient(270deg, #9ba1a7 0%, #808389 100%);
        box-shadow: 0px 10px 17px 0px rgba(118, 120, 123, 0.16), inset 0px 1px 6px 0px rgba(106, 108, 114, 0.6);
        border-image: linear-gradient(180deg, rgba(188, 192, 196, 1), rgba(195, 197, 199, 1)) 1 1;
    }
    .sign-up-cursor-default {
        cursor: default;
    }
}
</style>
