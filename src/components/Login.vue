<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { McTabs, McTab, McTextLink } from 'meetcode-ui';
import { NForm, NFormItem, NInput, NInputGroup, NButton, NSelect, NCheckbox } from 'naive-ui';
import { useLoginSetup } from '@@/composable';
import { useLogin, useAppConfig } from '@@/store';
import { promiseTimeout } from '@vueuse/shared';
import { useTimeoutPoll } from '@vueuse/core';
import { useRouter, useRoute } from 'vue-router';
import { RegisterProtocol, PrivacyPolicy, ForgotPassword } from '@@/constants';
import type { SelectOption, FormRules, FormInst } from 'naive-ui';
import type { Track } from '@@/api/hr';

interface LoginData {
    zip: string;
    phone?: string;
    email: string;
    password: string;
    captcha: string;
    remember: boolean;
}

const emit = defineEmits<{
    (e: 'login', value: { way: 'captcha' | 'form' }): void;
    (e: 'register', value: { way: 'captcha' | 'form' }): void;
    (e: 'updateOpenBigDay', value: string): void;
}>();

const router = useRouter();
const route = useRoute();
const { loginWithCaptcha, loginWithPassword, validatePhone } = useLogin();
const { themeColor, enableSignup, trackInfo } = storeToRefs(useAppConfig());
const { isActive, pause, resume } = useTimeoutPoll(async () => {
    await promiseTimeout(1000);

    if (--countDown.value === 0) {
        pause();
    }
}, 1000);
const countDown = ref(60);
const publicKey = ref('');
const mode = ref<'domestic' | 'abroad'>('domestic');
const loginForm = ref<FormInst>();
const loginTab = ref('register');
const loginData = ref<LoginData>({
    zip: '+86',
    phone: '',
    email: '', // 也可能是手机
    password: '',
    captcha: '',
    remember: false
});
const countryCodes = ref<SelectOption[]>([
    {
        label: '中国 +86',
        value: '+86'
    }
]);
const rules: FormRules = {
    phone: [
        {
            key: 'phone',
            trigger: ['blur', 'input'],
            validator: (rule, value) => {
                const testPhone = (phone: string) => {
                    if (loginData.value.zip === '+86') {
                        return /^[\d-]+$/g.test(phone) && phone.length === 11;
                    } else {
                        return /^\d{3,}$/.test(phone);
                    }
                };

                if (!value) {
                    return new Error('请填写手机号码');
                } else if (!testPhone(value as string)) {
                    return new Error('请输入正确的手机号码');
                }
            }
        }
    ],
    captcha: [
        {
            trigger: ['blur'],
            message: '请填写验证码',
            required: true
        }
    ],
    email: [
        {
            trigger: ['blur'],
            message: '请填写邮箱或手机号码',
            required: true
        }
    ],
    password: [
        {
            trigger: ['blur'],
            message: '请输入密码',
            required: true
        }
    ]
};

const handleSendCaptcha = async (payload?: Event) => {
    loginForm.value?.validate(
        async validError => {
            if (validError) return;

            const { zip, phone } = loginData.value;
            await validatePhone({ phone: `${zip}${phone}` });
            countDown.value = 60;
            resume();
        },
        rule => rule?.key === 'phone'
    );
};
const handleLogin = (payload: Event, type: 'captcha' | 'password') => {
    loginForm.value?.validate(async error => {
        if (error) return;

        const { zip, phone, captcha, email, password, remember } = loginData.value;
        const { type: loginType, way } = await (type === 'captcha'
            ? loginWithCaptcha({ account: `${zip}${phone}`, captcha, remember: false })
            : loginWithPassword({
                  account: mode.value === 'domestic' ? email : `${zip}${phone}`,
                  password,
                  remember,
                  publicKey: publicKey.value
              }));
        // 登录成功之后...
        emit(loginType as keyof typeof emit, { way });

        const track = trackInfo.value.track as Track;
        const buttonLink = track.buttonLink;
        if (enableSignup.value && buttonLink === 'sign') {
            router.push({ path: 'sign', query: route.query });
        }
    });
};
const handleChangeMode = () => {
    mode.value = mode.value === 'domestic' ? 'abroad' : 'domestic';
};

onMounted(async () => {
    const { countryCodes: codes, publicKey: key } = await useLoginSetup();

    countryCodes.value = codes;
    publicKey.value = key;
});
</script>

<template>
    <div class="tw-flex tw-flex-col tw-items-center">
        <McTabs v-model:value="loginTab" type="segment" class="tw-w-48" :active-color="themeColor" @tab-switch="mode = 'domestic'">
            <McTab name="register">注册登录</McTab>
            <McTab name="login">密码登录</McTab>
        </McTabs>
        <div class="tw-pt-8 tw-pb-5 tw-w-[320px]">
            <NForm class="tw-relative" ref="loginForm" :model="loginData" :show-label="false" :rules="rules">
                <template v-if="loginTab === 'register'">
                    <NFormItem path="phone">
                        <NInputGroup>
                            <NSelect v-model:value="loginData.zip" :options="countryCodes" :consistent-menu-width="false" class="tw-min-w-[100px] tw-w-[100px]" />
                            <NInput v-model:value="loginData.phone" placeholder="请输入手机号码" clearable />
                        </NInputGroup>
                    </NFormItem>
                    <NFormItem path="captcha">
                        <NInputGroup>
                            <NInput v-model:value="loginData.captcha" placeholder="请输入验证码" />
                            <NButton type="success" :color="themeColor" :disabled="isActive" @click="handleSendCaptcha">{{ isActive ? `重新发送(${countDown})` : '发送验证码' }}</NButton>
                        </NInputGroup>
                    </NFormItem>
                    <NButton class="tw-mt-[30px]" type="success" :color="themeColor" block @click="handleLogin($event, 'captcha')">注册 / 登录</NButton>
                </template>
                <template v-else-if="publicKey">
                    <NFormItem v-if="mode === 'domestic'" path="email">
                        <NInput v-model:value="loginData.email" placeholder="请输入邮箱/手机号码" clearable />
                    </NFormItem>
                    <NFormItem v-else path="phone">
                        <NInputGroup>
                            <NSelect v-model:value="loginData.zip" :options="countryCodes" :consistent-menu-width="false" class="tw-min-w-[100px] tw-w-[100px]" />
                            <NInput v-model:value="loginData.phone" placeholder="请输入手机号码" clearable />
                        </NInputGroup>
                    </NFormItem>
                    <NFormItem path="password">
                        <NInput v-model:value="loginData.password" type="password" placeholder="请输入密码" show-password-on="click" />
                    </NFormItem>
                    <div class="tw-absolute tw-w-full tw-flex tw-items-center tw-justify-between tw-bottom-[42px]">
                        <McTextLink @click="handleChangeMode">海外手机号登录</McTextLink>
                        <div class="tw-flex tw-items-center">
                            <NCheckbox v-model:checked="loginData.remember" size="small">下次自动登录</NCheckbox>
                            <McTextLink :to="ForgotPassword" target="_blank">忘记密码</McTextLink>
                        </div>
                    </div>
                    <NButton class="tw-mt-[30px]" type="success" :color="themeColor" block @click="handleLogin($event, 'password')">登录</NButton>
                </template>
                <div v-else class="tw-flex tw-items-center tw-justify-center tw-h-[180px] tw-text-[#999]">获取公钥出错，请联系牛客工作人员</div>
            </NForm>
            <div class="tw-mt-9 tw-text-center tw-text-[12px]">
                未注册手机验证后自动登录，注册即代表同意<McTextLink :to="RegisterProtocol" target="_blank">《注册协议》</McTextLink>和<McTextLink :to="PrivacyPolicy" target="_blank">《隐私政策》</McTextLink>
            </div>
        </div>
    </div>
</template>
