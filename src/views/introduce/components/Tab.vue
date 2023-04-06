<script lang="ts" setup>
import { useAppConfig } from '@@/store';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { AcmGio } from '@@/gio';
const { contestId } = useAppConfig();
const { appConfig, trackInfo } = storeToRefs(useAppConfig());

const router = useRouter();
const route = useRoute();
const handleSelectTrack = (id: number) => {
    AcmGio.contestTrackClick({
        platForm_var: 'pc',
        channel_var: route.query.channel,
        contestID_var: contestId,
        contestName_var: appConfig.value?.contestName,
        contestApplyTrack_var: id
    });
    router.push({ path: `/${contestId}/introduce`, hash: `#${id}`, query: route.query });
};
function isActive(item: { label: string; value: number }, index: number) {
    if (route.hash === '') {
        return index === 0;
    } else {
        const id = +route.hash.slice(1);
        return id === item.value;
    }
}
</script>

<template>
    <div class="tw-flex tw-font-medium tw-text-2xl tw-leading-[26px]">
        <div v-for="(item, index) of trackInfo.sortedTracks" :key="item.value" class="tw-flex tw-justify-center tw-items-center tw-cursor-pointer item" :class="{ 'item-active': isActive(item, index) }" @click="handleSelectTrack(item.value)">
            {{ item.label }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.item {
    margin-right: 30px;
    width: 139px;
    height: 47px;
    border-radius: 10px;
    border: 1px solid #ffffff;
    filter: blur(0px);

    color: #363636;
    background: linear-gradient(360deg, #fefeff 0%, #f5f7f9 100%);
    box-shadow: 0px 5px 10px 0px rgba(89, 91, 95, 0.07), inset 0px 1px 4px 0px rgba(0, 0, 0, 0.06);
    &-active {
        color: #fff;
        background: var(--theme-color);
    }
}
</style>
