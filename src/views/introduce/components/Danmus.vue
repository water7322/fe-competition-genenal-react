<script lang="ts" setup>
import type { PropType } from 'vue';
import { nextTick, onMounted, onBeforeUnmount, ref, toRefs, reactive, watch, useSlots } from 'vue';
import type { Danmu, DanmuItem, DanmakuItem } from '@/interface';

const props = defineProps({
    /**
     * 弹幕列表数据
     */
    danmus: {
        type: Array as PropType<Danmu[]>,
        required: true,
        default: () => []
    },
    /**
     * 轨道数量，0为最大轨道数量（撑满容器）
     */
    channels: {
        type: Number,
        default: 0
    },
    /**
     * 是否循环播放
     */
    loop: {
        type: Boolean,
        default: false
    },
    /**
     * 弹幕刷新频率(ms)
     */
    debounce: {
        type: Number,
        default: 5000
    },

    /**
     * 弹幕速度（像素/秒）
     */
    speeds: {
        type: Number,
        default: 200
    },
    /**
     * 弹幕字号（仅文本模式）
     */
    fontSize: {
        type: Number,
        default: 18
    },
    /**
     * 弹幕垂直间距
     */
    top: {
        type: Number,
        default: 4
    },
    /**
     * 弹幕水平间距
     */
    right: {
        type: Number,
        default: 0
    },
    /**
     * 是否开启弹幕插槽，默认否
     */
    useSlot: {
        type: Boolean,
        default: false
    }
});
const slots = useSlots();
const emits = defineEmits(['done']);
const { danmus, channels, loop, useSlot, debounce, speeds, fontSize, top, right } = toRefs(props);

// 容器
const container = ref<HTMLDivElement>(document.createElement('div'));
const dmContainer = ref<HTMLDivElement>(document.createElement('div'));
const danmakuWidth = ref(0);
const danmakuHeight = ref(0);
// 变量
let timer: any = 0;
const danmuList = ref<Danmu[]>([]);
const index = ref<number>(0);

const danmaku: DanmakuItem = reactive({
    channels: channels.value || 0, // 轨道数量
    loop: false, // 是否循环
    debounce: 5000, // 弹幕刷新频率(ms)
    useSlot: false // 是否开启slot
});
const danmu: DanmuItem = reactive({
    height: 0, // 弹幕元素高度
    fontSize: 18, // 弹幕元素字号（slot下不可用）
    speeds: 200, // 弹幕速度
    top: 4, // 弹幕垂直间距
    right: 0 // 弹幕水平间距
});

function init() {
    danmakuWidth.value = container.value.offsetWidth;
    danmakuHeight.value = container.value.offsetHeight;
    // initConfig
    danmus.value.forEach((item: Danmu) => {
        danmuList.value.push(item);
    });

    danmaku.channels = channels.value;
    danmaku.loop = loop.value;
    danmaku.useSlot = useSlot.value;
    danmaku.debounce = debounce.value;

    danmu.fontSize = fontSize.value;
    danmu.speeds = speeds.value;
    danmu.top = top.value;
    danmu.right = right.value;
    // 自动播放
    clearTimeout(timer);
    timer = setInterval(draw, debounce.value);
}
/**
 * 绘制弹幕
 */
function draw() {
    if (danmuList.value.length) {
        if (index.value > danmuList.value.length - 1) {
            if (danmaku.loop) {
                index.value = 0;
                insert();
            }
            // 播放完成
            emits('done');
        } else {
            insert();
        }
    }
}

/**
 * 插入弹幕
 */
function insert() {
    const _index = loop.value ? index.value % danmuList.value.length : index.value;
    let el = document.createElement('div');
    if (danmaku.useSlot) {
        el = getSlotComponent(_index).$el;
    } else {
        const obj = danmuList.value[_index] as any;
        el.innerHTML = obj.name + obj.awardName;
        // el.style.fontSize = danmu.fontSize + 'px'
        // el.style.lineHeight = danmu.fontSize + 'px'
    }
    el.classList.add('dm');
    dmContainer.value.appendChild(el);

    el.classList.add('dm');
    dmContainer.value.appendChild(el);
    nextTick(() => {
        if (!danmu.height || !danmaku.channels) {
            danmu.height = el.offsetHeight;
            // 如果没有设置轨道数，则在获取到所有高度后计算出最大轨道数
            if (!danmaku.channels) {
                danmaku.channels = Math.floor(danmakuHeight.value / (danmu.height + danmu.top));
            }
        }
        const channelIndex = _index % danmaku.channels;
        if (channelIndex >= 0) {
            const width = el.offsetWidth;
            const height = danmu.height;
            const speeds = danmakuWidth.value / danmu.speeds;
            el.classList.add('move');
            el.style.animationDuration = `${speeds}s`;
            el.style.top = `${channelIndex * (height + danmu.top)}px`;
            // + danmu.right
            el.style.width = `${width + danmu.right}px`;
            el.style.setProperty('--dm-left-offset', `-${danmakuWidth.value}px`);
            el.dataset.index = `${channelIndex}`;
            el.addEventListener('animationend', () => {
                dmContainer.value.removeChild(el);
            });
            if (el.classList.length > 0) {
                index.value++;
            }
        } else {
            if (el.classList.length > 0) {
                dmContainer.value.removeChild(el);
            }
        }
    });
}
function getSlotComponent(index: number) {
    const DmComponent = createApp({
        render() {
            return h('div', {}, [
                // @ts-expect-error 我也不懂tslint报错的原因，以后再修吧
                slots.dm({
                    danmu: danmuList.value[index],
                    index
                })
            ]);
        }
    });
    const ele = DmComponent.mount(document.createElement('div'));
    return ele;
}

watch(
    () => props.danmus,
    val => (danmuList.value = [...val])
);

watch(
    () => props.debounce,
    () => init()
);

onMounted(() => {
    init();
});

onBeforeUnmount(() => {
    // 清空弹幕
    clearInterval(timer);
    timer = 0;
    index.value = 0;
});
</script>
<template>
    <div ref="container" class="vue-danmaku">
        <div class="start-bg" />
        <div class="end-bg" />
        <div ref="dmContainer" class="danmus show" />
    </div>
</template>
<style lang="scss">
.vue-danmaku {
    position: relative;
    overflow: hidden;
    .start-bg {
        z-index: 2;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 66px;
        background: linear-gradient(90deg, #f9fafc 0%, rgba(249, 249, 251, 0) 100%);
        box-shadow: 0px 8px 13px 0px rgba(49, 50, 53, 0);
    }
    .end-bg {
        z-index: 2;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        width: 66px;
        background: linear-gradient(270deg, #f5f6f9 0%, rgba(245, 246, 249, 0) 100%);
        box-shadow: 0px 8px 13px 0px rgba(49, 50, 53, 0);
    }
    .danmus {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        &.show {
            opacity: 1;
        }
        .dm {
            position: absolute;
            right: 0;
            font-size: 12px;
            white-space: pre;
            transform: translateX(100%);
            border-radius: 12px;
            font-weight: 400;
            padding: 6px 8px;
            text-align: center;
            &.move {
                will-change: transform;
                animation-name: moveLeft;
                animation-timing-function: linear;
                animation-play-state: running;
            }
            &.move[data-index='0'] {
                background: #e5fffc;
                color: #5ca8a0;
            }
            &.move[data-index='1'] {
                background: #e5f6ff;
                color: #4977bb;
            }
        }
        @keyframes moveLeft {
            from {
                transform: translateX(100%);
            }
            to {
                transform: translateX(var(--dm-left-offset));
            }
        }
        @-webkit-keyframes moveLeft {
            from {
                -webkit-transform: translateX(100%);
            }
            to {
                -webkit-transform: translateX(var(--dm-left-offset));
            }
        }
    }
}
</style>
