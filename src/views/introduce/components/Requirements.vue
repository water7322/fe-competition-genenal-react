<script lang="ts" setup>
import { ref, toRefs, onMounted, nextTick } from 'vue';

const props = defineProps<{
    requirements: string;
}>();
const { requirements } = toRefs(props);
onMounted(() => {});
const isExpand = ref(false);
const isOver = ref(false);
const text = ref(null);

nextTick(() => {
    if ((text?.value as any).scrollHeight > 150) {
        isOver.value = true;
    }
});
</script>

<template>
    <div class="tw-relative tw-mb-5">
        <div class="tw-text-[22px] tw-leading-[26px] tw-font-medium tw-text-[#353535]">赛道要求</div>
        <div class="bar"></div>
        <div ref="text" class="tw-text-[#6a6b71] tw-leading-[30px] tw-text-base tw-px-4 tw-overflow-hidden tw-whitespace-pre-wrap" :class="isOver && !isExpand ? 'ellipsis' : ''" :style="!isExpand ? 'max-height: 150px;' : ''" v-html="requirements"></div>
        <div v-if="isOver" class="btn tw-text-right tw-text-base tw-mr-5 tw-cursor-pointer" @click="isExpand = !isExpand">{{ isExpand ? '收起' : '查看全部' }}</div>
    </div>
</template>

<style scoped lang="scss">
.bar {
    height: 6px;
    width: 33px;
    background: var(--theme-color);
    transform: skew(-30deg);
    margin-top: 2px;
    margin-bottom: 19px;
}
.ellipsis {
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
}
.btn {
    color: var(--theme-color);
}
</style>
