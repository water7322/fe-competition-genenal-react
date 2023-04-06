<script setup lang="ts">
import type { PropType } from 'vue';
import { toRefs, onMounted, onBeforeUnmount } from 'vue';
import type { ITimeLineItem } from '@/interface';
import { TimelineStatus } from '@/interface';
const props = defineProps({
    timeLineList: {
        type: Array as PropType<ITimeLineItem[]>,
        required: true,
        default: () => []
    }
});
const emits = defineEmits(['refresh']);
const { timeLineList } = toRefs(props);
const timeline = ref();
const currentIndex = ref(0);
const scrollX = ref(0);
const currentScrollLeft = ref(0);
const isDown = ref(false);
let timer: any = null;

const nextIndex = computed(() => {
    const now = Date.now();
    let min = 0;
    let index = 0;
    timeLineList.value.forEach((node, i) => {
        if (node.status !== TimelineStatus.PAST && node.beginTime > now) {
            const temp = node.beginTime - now;
            if (min === 0) {
                min = temp;
                index = i;
            } else {
                if (min > temp) {
                    min = temp;
                    index = i;
                }
            }
        }
    });
    return index;
});

function go(index: number) {
    currentIndex.value = index;
    emits('refresh');
    // TOOD bug死循环
    // setGo()
    scrollTime(index);
}
/**
 * 自动切换方法
 * goSpeed：切换速度
 */
function setGo() {
    // 获取与当前时间最近的节点
    const index = nextIndex.value;
    const node = timeLineList.value[index];
    const interval = node.beginTime - Date.now();
    if (interval < 0) return;
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
        go(index);
    }, interval);
}
/**
 * 滚动计算法
 */
function scrollTime(index: number) {
    if (index >= timeLineList.value.length - 2 || index <= 2) return;
    const ele = document.getElementById(`timeItem${index - 1}`);
    if (!ele) return;
    const bound = ele?.getBoundingClientRect();
    timeline.value.scrollTo(bound?.left || bound?.x || 0, 0);
}

onMounted(() => {
    setGo();
    // 先滑动到最近节点
    scrollTime(nextIndex.value);
});

onBeforeUnmount(() => {
    clearTimeout(timer);
});
function joinTrack(trackLink: string) {
    window.location.href = trackLink;
}
function handleMousedown(event) {
    isDown.value = true;
    const downX = event.clientX;
    scrollX.value = downX;
    currentScrollLeft.value = timeline.value.scrollLeft;
}
function handleMousemove(event) {
    if (!isDown.value) return;
    const moveX = event.clientX;
    timeline.value.scrollTo(currentScrollLeft.value + scrollX.value - moveX, 0);
}
function reset() {
    isDown.value = false;
}
</script>

<template>
    <ul ref="timeline" class="my-timeline ul_box" @mousedown="handleMousedown" @mousemove="handleMousemove" @mouseup="reset" @mouseleave="reset">
        <li v-for="(item, index) in timeLineList" :id="`timeItem${index}`" :key="index" class="my-timeline-item">
            <!--圈圈节点-->
            <div :class="[item.status === TimelineStatus.PAST ? 'pasted' : 'future', 'my-timeline-item-node-size']" />
            <!-- <div v-if="item.status === TimelineStatus.TRACK" class="my-timeline-item-node" @click="joinTrack(item.trackLink)">进入比赛</div> -->
            <!--线-->
            <div v-if="index !== timeLineList.length - 1" :class="[item.status === TimelineStatus.PAST ? 'slode' : 'dashed', 'my-timeline-item-line']" />
            <!--标注-->
            <div class="my-timeline-item-content">
                <span class="time-line-sub-font one-line">{{ item.timestamp }}</span>
                <span class="time-line-font one-line tw-mt-[6px]">{{ item.name }}</span>
            </div>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
$item-node-size: var(--timeline-node-size);
$item-node-half-size: var(--timeline-node-size-half);
$item-node-future: #cccecd;
$tile-line-content-color: #5d5d5d;
$tile-line-content-sub-color: #767676;
.ul_box {
    padding-bottom: var(--timeline-half-height);
    padding-left: var(--timeline-half-height);
    overflow-x: auto;
    overflow-y: hidden;
    &::-webkit-scrollbar {
        display: none;
    }
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
}
.my-timeline {
    display: flex;
    list-style: none;
    text-align: center;
    &-item {
        flex: 1 0 150px;
        height: $item-node-half-size;
        position: relative;
        &:last-child {
            flex: 0;
        }
        &-node-size {
            width: $item-node-size;
            height: $item-node-size;
            border-radius: 100%;
            &.pasted {
                width: $item-node-size;
                height: $item-node-size;
                border-radius: 100%;
                background: var(--theme-color);
            }
            &.next {
                width: $item-node-size;
                height: $item-node-size;
                border-radius: 100%;
                box-shadow: inset 0 0 0 var(--timeline-node-circle) var(--theme-color);
            }
            &.future {
                width: $item-node-size;
                height: $item-node-size;
                border-radius: 100%;
                background: url('@/assets/future.png');
                background-size: 20px 20px;
            }
        }
        &-node {
            position: absolute;
            top: calc(var(--timeline-join-node) * -1);
            left: -40px;
            padding: 8px 14px;
            font-size: var(--more-font-size);
            line-height: var(--more-font-size);
            font-weight: 600;
            color: var(--theme-color);
            background: #fafafb;
            box-shadow: inset 0px 3px 1px 0px rgba(97, 97, 97, 0.14);
            border-radius: 6px;
            border: 1px solid var(--theme-color);
            white-space: nowrap;
            cursor: pointer;
        }
        &-line {
            margin: calc(var(--timeline-node-size-half) * -1) 0 0 $item-node-size;
            border-left: none;
            &.slode {
                border-top: 2px solid var(--theme-color);
            }
            &.dashed {
                border-top: 2px dashed $item-node-future;
            }
        }
        .one-line {
            @apply tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap;
        }
        .time-line-font {
            font-size: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            line-height: 20px;
            color: $tile-line-content-color;
        }
        .time-line-sub-font {
            font-size: 18px;
            font-family: D-DIN, D;
            font-weight: normal;
            line-height: 18px;
            color: $tile-line-content-sub-color;
        }
        &-content {
            @apply tw-flex tw-flex-col tw-cursor-pointer tw-absolute;
            bottom: calc(var(--timeline-half-height) * -1);
            transform: translate(-39%, 0);
        }
    }
}
</style>
