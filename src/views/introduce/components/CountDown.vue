<script setup lang="ts">
import { onMounted, computed, ref, watch, toRefs } from 'vue';
const props = defineProps({
    time: {
        type: [Number, String],
        default: 0
    },
    end: {
        type: [Number, String],
        default: 0
    },
    isMiniSecond: {
        type: Boolean,
        default: false
    }
});
const { end, time } = toRefs(props);
const emits = defineEmits(['refresh']);
const days = ref(0);
const hours = ref(0);
const mins = ref(0);
const seconds = ref(0);
let timer: any = null;
const curTime = ref(0);
const duration = computed(() => {
    if (end) {
        // 截止时间
        let durationTime = String(end.value).length >= 13 ? +end.value : +end.value * 1000;
        // durationTime = 1658750357000;
        durationTime -= Date.now();
        durationTime = String(end.value).length >= 13 ? Math.round(durationTime / 1000) : Math.round(durationTime);
        return durationTime;
    }
    // 剩余时间
    const durationTime = String(time.value).length >= 13 ? Math.round(+time.value / 1000) : Math.round(+time.value);
    return durationTime;
});

const countDown = () => {
    curTime.value = Date.now();
    getTime(duration.value);
};
/**
 * 格式化
 * @param {number} time 时间
 */
function getTime(time: number) {
    timer && clearTimeout(timer);
    if (time < 0) {
        days.value = 0;
        hours.value = 0;
        mins.value = 0;
        seconds.value = 0;
        return;
    }
    const { dd, hh, mm, ss } = durationFormatter(time);
    if (!dd && !hh && !mm && !ss) {
        emits('refresh');
    }
    days.value = dd || 0;
    hours.value = hh || 0;
    mins.value = mm || 0;
    seconds.value = ss || 0;
    timer = setTimeout(() => {
        const now = Date.now();
        const diffTime = Math.floor((now - curTime.value) / 1000);
        const step = diffTime > 1 ? diffTime : 1; // 页面退到后台的时候不会计时，对比时间差，大于1s的重置倒计时
        curTime.value = now;
        getTime(time - step);
    }, 1000);
}

/**
 * 格式化
 * @param {number} time 时间
 * @return {Object}
 */
function durationFormatter(time: number) {
    if (!time) return { ss: 0 };
    let t = time;
    const ss = t % 60;
    t = (t - ss) / 60;
    if (t < 1) return { ss };
    const mm = t % 60;
    t = (t - mm) / 60;
    if (t < 1) return { mm, ss };
    const hh = t % 24;
    t = (t - hh) / 24;
    if (t < 1) return { hh, mm, ss };
    const dd = t;
    return { dd, hh, mm, ss };
}

onMounted(() => {
    countDown();
});

watch(duration, countDown, { deep: true, immediate: true });
</script>
<template>
    <div class="content">
        <slot
            v-bind="{
                d: days,
                h: hours,
                m: mins,
                s: seconds,
                dd: `00${days}`.slice(-2),
                hh: `00${hours}`.slice(-2),
                mm: `00${mins}`.slice(-2),
                ss: `00${seconds}`.slice(-2)
            }"
        />
    </div>
</template>
