<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { pausableWatch } from '@vueuse/core';
import { RankTable, RankColumn } from './components';
import { useAppConfig } from '@@/store';
import { getRank } from '@@/api/hr';
import { NRadio, NRadioGroup, NSpace, NPagination } from 'naive-ui';

const { appConfig, trackInfo } = storeToRefs(useAppConfig());
const { contestId } = useAppConfig();
const route = useRoute();

// 初始化数据
const tracks = computed(() => appConfig.value?.rankConf.tracks);
const rounds = computed(() => tracks.value?.find(track => track.id === currentTrack.value)?.rounds);
const rankingRule = computed(() => rounds.value?.find(round => round.id === currentRound.value)?.content);
const tableFields = computed(() => rounds.value?.find(round => round.id === currentRound.value)?.fields);
const dataEmptyDesc = computed(() => rounds.value?.find(round => round.id === currentRound.value)?.emptyRankContent);
const tableData = ref<Record<string, unknown>[]>();

// 一些查询条件
const currentPage = ref(1);
const pageSize = ref(5);
const total = ref(0);
const currentTrack = ref<number>();
const currentRound = ref<number>();

watch(
    tracks,
    () => {
        const { track } = route.query;
        currentTrack.value = track ? +track : trackInfo.value.sortedTracks?.[0].value;
    },
    { immediate: true }
);

watch(
    currentTrack,
    () => {
        const { round } = route.query;
        currentRound.value = round ? +round : rounds.value?.[0].id;
    },
    { immediate: true }
);

watch(
    currentRound,
    () => {
        currentPage.value = 1;
        pageSize.value = 5;
        tableData.value = [];
    },
    { immediate: true }
);

const { pause, resume } = pausableWatch(
    [currentRound, currentPage, pageSize],
    async () => {
        if (!currentTrack.value || !currentRound.value) return;
        const { data } = await getRank({
            query: {
                contestId,
                trackId: currentTrack.value,
                roundId: currentRound.value,
                page: currentPage.value,
                pageSize: pageSize.value
            }
        });

        if (data) {
            // 防止无限循环
            pause();
            const { currentPage: page, pageSize: size, totalCount, data: rankData } = data;
            currentPage.value = page || 1;
            pageSize.value = size;
            total.value = totalCount;
            tableData.value = rankData.map(item => {
                const obj: Record<string, unknown> = {};
                item.forEach((e, index) => (obj[tableFields.value![index].type] = e));
                return obj;
            });

            // 重新监听
            resume();
        }
    },
    { immediate: true }
);

const handleChangeTab = (trackId: number) => {
    currentTrack.value = trackId;
};
</script>

<template>
    <div v-if="appConfig" class="intro-container">
        <!-- 排行榜和赛道的选择 -->
        <div class="rank-channel">
            <div v-if="tracks" class="rank-tabs">
                <div
                    v-for="item of trackInfo.sortedTracks"
                    :key="item.value"
                    class="tab tw-text-2xl tw-leading-[26px] tw-font-medium tw-flex tw-justify-center tw-items-center tw-cursor-pointer"
                    :class="{ 'active-tab': currentTrack === item.value }"
                    @click="handleChangeTab(item.value)"
                >
                    {{ item.label }}
                </div>
            </div>
            <NRadioGroup v-if="rounds" v-model:value="currentRound" class="tw-w-full" size="large">
                <NSpace justify="space-evenly">
                    <NRadio v-for="(item, index) in rounds" :key="`channel${index}`" :value="item.id">{{ item.name }}</NRadio>
                </NSpace>
            </NRadioGroup>
        </div>
        <!-- 排行榜规则，支持HTML文本。规则大概会跟着排行榜切换，暂时不写死， -->
        <div v-if="rankingRule" class="tw-text-lg tw-font-medium tw-leading-[30px] tw-my-4" v-html="rankingRule"></div>
        <!-- 编程赛道 -->
        <div v-if="total === 0" class="empty">{{ dataEmptyDesc }}</div>
        <RankTable v-else :value="tableData" :key="currentTrack! + currentRound!">
            <RankColumn v-for="field in tableFields" :key="field.type" :title="field.name">
                <template #body="scope">
                    <div v-if="field.type === 'rank'">
                        <img v-if="+scope.row.rank === 1" class="icon-rank" src="../../assets/rank1.png" alt="" />
                        <img v-else-if="+scope.row.rank === 2" class="icon-rank" src="../../assets/rank2.png" alt="" />
                        <img v-else-if="+scope.row.rank === 3" class="icon-rank" src="../../assets/rank3.png" alt="" />
                        <div v-else>{{ +scope.row.rank }}</div>
                    </div>
                    <div v-else>{{ scope.row[field.type] }}</div>
                </template>
            </RankColumn>
        </RankTable>
        <div v-if="total !== 0" class="tw-mt-12 tw-flex tw-justify-end">
            <NPagination v-model:page="currentPage" v-model:page-size="pageSize" :item-count="total" size="large" show-quick-jumper>
                <template #prefix="{ itemCount }">共 {{ itemCount }} 条</template>
                <template #goto>前往</template>
                <template #suffix>页</template>
            </NPagination>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.intro-container {
    padding-bottom: 88px;
    max-width: 1000px;
    margin: 0 auto;

    .rank-channel {
        padding-bottom: 42px;

        .rank-tabs {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            margin-bottom: 60px;
            box-sizing: border-box;
            .tab {
                width: 139px;
                height: 47px;
                border-radius: 10px;
                border: 1px solid #ffffff;
                filter: blur(0px);
                color: #363636;
                background: linear-gradient(360deg, #fefeff 0%, #f5f7f9 100%);
                box-shadow: 0px 5px 10px 0px rgba(89, 91, 95, 0.07), inset 0px 1px 4px 0px rgba(0, 0, 0, 0.06);
                margin-right: 30px;
                &:nth-child(3n) {
                    // margin-right: 0;
                }
                &:last-child {
                    margin-right: 0;
                }
                &.active-tab {
                    color: #ffffff;
                    background: var(--theme-color);
                }
            }
        }
    }

    .icon-rank {
        width: 36px;
        height: 36px;
    }
}

.empty {
    background: #dde8ff;
    padding: 20px 0;
    border-radius: 26px;
    border: 1px solid #cfd5dc;
    text-align: center;
}
</style>

<style>
.pagination-container .el-pagination .btn-next {
    background-color: #fff;
}
.pagination-container .el-pagination.is-background .el-pager li:not(.is-disabled).is-active {
    background-color: var(--basis-color);
}

.pagination-container .el-pagination .el-pager li {
    background-color: #fff;
    border-radius: 50%;
    font-size: var(--normal-font-size);
}

.pagination-container .el-pager li:hover {
    color: var(--basis-color) !important;
}
</style>
