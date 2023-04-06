<script lang="ts" setup>
import { getLotteryRecords } from '@@/api/m';
import type { LotteryRecords } from '@@/api/m';
import { Danmus } from './';
import Section from '@/components/Section.vue';
import { useLogin } from '@@/store';
import { useLoginModal } from '@/composable';
import { storeToRefs } from 'pinia';
import { useAppConfig } from '@@/store';
import ENV from '@@/env.json';
const { appConfig } = storeToRefs(useAppConfig());
const { isLogin } = storeToRefs(useLogin());
const lotteryId = computed(() => appConfig.value?.lotteryConf?.lotteryId);
const props = defineProps<{
    introduceConfigLottery: {
        title: string;
        children: {
            bg: string;
            content: string;
        }[];
    };
}>();
const { introduceConfigLottery } = toRefs(props);
/**
 * 按钮点击
 */
function onBtnClick() {
    if (!isLogin.value) {
        useLoginModal();
        return;
    }
    window.open(`${ENV[process.env.NODE_ENV || 'development'].M}/lottery/draw?activityId=${lotteryId.value}`, '_blank');
}

// 弹幕
const danmus = ref<Array<LotteryRecords>>([]);
const pageCount = ref(1);
const config = reactive({
    channels: 2, // 轨道数量，为0则弹幕轨道数会撑满容器
    loop: true, // 是否开启弹幕循环
    speeds: 50, // 弹幕速度，实际为每秒弹幕走过的像素距离
    fontSize: 12, // 文本模式下的字号
    top: 8, // 弹幕轨道间的垂直间距
    right: 20, // 同一轨道弹幕的水平间距
    debounce: 2000, // 弹幕刷新频率（多少毫秒插入一条弹幕，建议不小于50）
    useSlot: true
});
// 获取弹幕
function getDanmusLottery(activityId: number, page: number) {
    getLotteryRecords({
        query: {
            activityId,
            page
        }
    }).then(res => {
        if (res.error || !res.data) {
            return;
        }
        danmus.value = res.data;
        if (danmus.value.length < 2) {
            config.debounce = 4000;
        }
    });
}

function danmuDone() {
    console.log('弹幕播放完毕');
}
onMounted(() => {
    getDanmusLottery(lotteryId.value!, pageCount.value);
});
</script>
<template>
    <Section :title="introduceConfigLottery.title" class="tw-pt-6">
        <div class="tw-text-center tw-font-light tw-text-base tw-text-[#5d5d5d]">完成报名，即可获得1次抽奖机会！</div>
        <div class="tw-flex tw-flex-wrap tw-justify-around tw-mx-28 tw-mt-[18px]" :class="{ 'items-more': introduceConfigLottery.children.length > 3 }">
            <div v-for="item of introduceConfigLottery.children" :key="item.content" class="item tw-mb-[22px] tw-text-sm tw-leading-[17px] tw-text-[#595a5f]" :class="{ 'item-more': introduceConfigLottery.children.length > 3 }">
                <div class="tw-p-3 tw-box-border tw-w-1/2">{{ item.content }}</div>
                <div class="tw-w-1/2 tw-pt-2 tw-pl-2 tw-overflow-hidden">
                    <img :src="item.bg" class="tw-w-full" />
                </div>
            </div>
        </div>
        <div class="btn" @click="onBtnClick">立即参与抽奖</div>

        <!-- 弹幕 -->
        <Danmus ref="danmaku" class="carousel" :danmus="danmus" v-bind="config" @done="danmuDone">
            <template #dm="{ danmu }">
                <div class="danmu-item">
                    <img class="img" :src="danmu.head" />
                    <span>{{ danmu.name }}{{ danmu.awardName }}</span>
                </div>
            </template>
        </Danmus>
    </Section>
</template>
<style lang="scss" scoped>
.items-more {
    @apply tw-justify-start;
}
.item-more {
    margin-left: calc(calc(100% - 588px) / 6);
    margin-right: calc(calc(100% - 588px) / 6);
}
.item {
    @apply tw-flex;
    width: 194px;
    height: 109px;
    background: #ffffff;
    box-shadow: inset 0px 2px 1px 0px rgba(239, 243, 247, 0.88);
    border-radius: 4px;
    border: 1px solid;
    border-image: linear-gradient(180deg, rgba(232, 235, 239, 1), rgba(242, 244, 248, 1)) 1 1;
}
.btn {
    @apply tw-flex tw-justify-center tw-items-center tw-cursor-pointer;
    margin: 0 auto;
    width: 234px;
    height: 62px;
    background: var(--theme-color);
    border-radius: 9px;
    border: 1px solid;
    filter: blur(0px);

    font-size: 29px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    line-height: 41px;
}

.carousel {
    margin-top: 34px;
    height: 100px;
}
.danmu-item {
    img {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        vertical-align: text-top;
        margin-right: 8px;
    }
}
</style>
