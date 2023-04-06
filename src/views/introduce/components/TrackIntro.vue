<script lang="ts" setup>
import { toRefs, onMounted } from 'vue';
import type { Description, Limit } from '@@/api/hr';

const props = defineProps<{
    description: Description;
    limit: Limit;
}>();
const { description, limit } = toRefs(props);
onMounted(() => {});
</script>

<template>
    <div>
        <div v-if="description" class="tw-text-[22px] tw-leading-[26px] tw-font-medium tw-text-[#353535]">{{ description.title }}</div>
        <div class="bar"></div>
        <div class="tw-text-[#6a6b71] tw-leading-[30px] tw-text-base tw-mb-5" v-html="description.content"></div>

        <div v-if="limit" class="tw-text-[22px] tw-leading-[26px] tw-font-medium tw-text-[#353535]">{{ limit.title }}</div>
        <div class="bar"></div>
        <div class="tw-text-[#6a6b71] tw-leading-[30px] tw-text-base tw-mb-5" v-html="limit.content"></div>
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
</style>
