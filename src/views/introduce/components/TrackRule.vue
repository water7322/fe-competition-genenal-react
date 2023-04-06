<script lang="ts" setup>
import { toRefs, onMounted } from 'vue';
const props = defineProps({
    intro: {
        type: Object,
        default: () => ({})
    }
});
const { intro } = toRefs(props);
onMounted(() => {});
</script>

<template>
    <div>
        <div v-if="intro.title" class="tw-text-[22px] tw-leading-[26px] tw-font-medium tw-text-[#353535]">{{ intro.title }}</div>
        <div class="bar"></div>

        <ul class="tw-list-none tw-px-4">
            <li v-for="(item, index) in intro.children" :key="index" class="tw-text-[#6a6b71] tw-leading-[30px] tw-text-base tw-mb-5 last:tw-mb-0 tw-whitespace-pre-wrap" v-html="item.content"></li>
        </ul>
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
