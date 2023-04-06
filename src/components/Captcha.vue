<script lang="ts" setup>
// 验证码弹窗
// 网易易盾开发文档 https://support.dun.163.com/documents/15588062143475712?docId=150442915877015552
// @ts-ignore
import Load from '@ncfe/nc.load';
import { getCaptchaConfig } from '@@/api/common/login';

interface PropsType {
    mode?: 'float' | 'embed' | 'popup';
    source?: 'netease' | 'gt';
    type?: string;
}

const props = withDefaults(defineProps<PropsType>(), {
    mode: 'embed',
    source: 'netease',
    type: 'login'
});

const emit = defineEmits<{
    (e: 'error'): void;
    (e: 'fail'): void;
    (e: 'success', value: string): void;
    (e: 'loaded', instance: any): void;
}>();

const isDestroyed = ref(false);
const error = ref('');
const captchaId = ref('');
const data = reactive<{ gt: any }>({
    gt: null
});
const captcha = ref(null);

async function tryCount(count: number, callback: () => Promise<any>) {
    let total = 0;
    count = Math.max(2, count);
    if (isDestroyed.value) return;
    return await _action();
    async function _action(): Promise<any> {
        try {
            return await callback();
        } catch (e) {
            // 出错重试
            total++;
            if (total >= count) return;
            await new Promise(resolve => setTimeout(() => resolve(null), 250));
            return await _action();
        }
    }
}

onMounted(async () => {
    await tryCount(5, async () => new Promise((resolve, reject) => Load.js('//cstaticdun.126.net/load.min.js', () => ((window as any).initNECaptcha ? resolve(0) : reject()))));
    if (!(window as any).initNECaptcha) return _error();
    const result = await fetchCaptchaConfig();
    if (result.error) return _error(result.msg);
    captchaId.value = result.data.captchaId;
    initCaptcha();

    function _error(msg = '') {
        // 验证码加载失败
        emit('error');
        error.value = msg || '验证码加载失败，请重试';
    }
});

onBeforeUnmount(() => {
    isDestroyed.value = true;
});

function initCaptcha() {
    (window as any).initNECaptcha(
        {
            captchaId: captchaId.value,
            element: captcha.value,
            mode: props.mode,
            width: 260,
            onVerify: async (err: any, data: any) => {
                // 验证失败
                err && emit('fail');
                // 验证通过
                // @arg {netease_validate: 验证字符串}
                !err && emit('success', data.validate);
            }
        },
        (instance: any) => {
            data.gt = instance;
            // 验证码加载成功
            emit('loaded', instance);
        },
        () => {
            // 验证码加载失败
            emit('error');
        }
    );
}

async function fetchCaptchaConfig() {
    const result = tryCount(5, async () => await getCaptchaConfig({ query: { source: props.source }, param: { type: props.type } }));
    return result;
}
</script>

<template>
    <div ref="captcha" class="captcha-container">
        {{ error }}
    </div>
</template>

<style lang="scss" scoped>
.captcha-container {
    text-align: center;
    min-height: 185px;
}
</style>
