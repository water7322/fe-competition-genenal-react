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
    <div v-if="intro.title" class="tw-text-[22px] tw-leading-[26px] tw-font-medium tw-text-[#353535]">{{ intro.title }}</div>
    <div class="bar"></div>

    <div class="tw-flex tw-items-start tw-flex-wrap tw-px-4" :class="{ 'tw-justify-center': intro.children.length < 3 }">
        <div v-for="(item, index) in intro.children" :key="index" class="prize-item">
            <div class="prize-item-card" :style="{ backgroundImage: `url('${item.bg}')`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', color: `${item.fontColor}` }" />
            <ul class="prize-item-limit">
                <li v-for="(limit, jndex) in item.children" :key="jndex" :class="{ first: jndex === 0 }">
                    {{ limit }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped lang="scss">
$colorHeader: #353535;
$font-sub: #656565;
$flex-width: calc(33.3333% - 41px);
$nth-num: 3n;

.bar {
    height: 6px;
    width: 33px;
    background: var(--theme-color);
    transform: skew(-30deg);
    margin-top: 2px;
    margin-bottom: 19px;
}
.prize-item {
    flex: 0 0 $flex-width;
    box-sizing: border-box;
    padding-bottom: 30px;
    margin-right: 42px;
    overflow: hidden;
    &:nth-child(3n) {
        margin-right: 0;
    }
    &:last-child {
        margin-right: 0;
    }
    &-card {
        width: 100%;
        padding-bottom: 57.8%;
        box-sizing: border-box;
        position: relative;
        border-radius: 6px;
    }
    &-limit {
        list-style: none;
        font-size: var(--normal-font-size);
        font-weight: 300;
        color: $font-sub;
        margin-top: 6px;
        overflow: hidden;
        .first {
            font-weight: 500;
        }
        li {
            position: relative;
            padding-left: 30px;
            margin-top: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: pre-wrap;
            &::before {
                content: '';
                width: 10px;
                height: 10px;
                background-color: #e4e9ed;
                position: absolute;
                top: 50%;
                left: 2px;
                transform: translate(0, -50%) rotate(45deg);
            }
        }
    }
}
</style>
