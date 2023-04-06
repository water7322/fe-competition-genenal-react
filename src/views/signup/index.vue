<script lang="ts" setup>
import { computed, createVNode, watch } from 'vue';
import { NForm, NInput, NGrid, NGridItem, NFormItemGridItem, NCheckbox, NCheckboxGroup, NDatePicker, NButton, NSelect } from 'naive-ui';
import Section from '@/components/Section.vue';
import { storeToRefs } from 'pinia';
import { useAppConfig, useUser } from '@@/store';
import { useMessage } from '@@/composable';
import { useRouter, useRoute } from 'vue-router';
import { signup } from '@@/api/hr';
import type { FunctionalComponent } from 'vue';
import type { FormItemRule, FormRules, FormInst } from 'naive-ui';
import type { UserSignupInfo, ISignupPayload } from '@@/api/hr';

const { contestId } = useAppConfig();
const { appConfig, device, themeColor, trackInfo, enableSignup } = storeToRefs(useAppConfig());
const { signupData: signupStoreData } = storeToRefs(useUser());
const router = useRouter();
const route = useRoute();
const signupForm = ref<FormInst>();
const tracks = computed(() => trackInfo.value.enableSignupTracks);
const fields = computed(() => appConfig.value?.signUpConf.fields);
const signupData = ref<ISignupPayload>({
    contestId,
    trackIds: [],
    platform: device.value.isMobile ? 'h5' : 'pc',
    userInfo: {
        MDSchool: '',
        eduLevel: '',
        idCard: '',
        workTime: null,
        realName: '',
        major: '',
        school: '',
        phone: '',
        email: ''
    }
});

if (!enableSignup.value) {
    useMessage().error('报名已结束');
    router.push({ path: 'introduce', query: route.query });
}

watch(
    signupStoreData,
    data => {
        if (data) {
            const { userInfo, trackIds } = data;
            signupData.value.trackIds = trackIds;
            // signupData.value.userInfo = { ...userInfo, workTime: +new Date(userInfo.workTime ? userInfo.workTime.toString() : '2007') };
            signupData.value.userInfo = { ...userInfo, workTime: userInfo.workTime || '2007' };
        }
    },
    { immediate: true }
);
watch(
    tracks,
    val => {
        // 如果只有一个赛道，默认选中该赛道
        if (val.length === 1) {
            signupData.value.trackIds[0] = val[0].id;
        }
    },
    {
        immediate: true
    }
);

const rules: Record<keyof Pick<ISignupPayload, 'trackIds' | 'userInfo'>, FormRules | FormItemRule> = {
    trackIds: {
        type: 'array',
        required: true,
        trigger: 'change',
        message: '请选择赛道'
    },
    userInfo: {
        eduLevel: {
            required: true,
            trigger: ['blur', 'change'],
            message: '请选择最高学历'
        },
        idCard: {
            required: true,
            trigger: ['blur', 'input'],
            validator: (rule, value) => {
                if (!value) {
                    return new Error('请填写身份证号');
                } else if (
                    !/^\d{6}((((((19|20)\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(((19|20)\d{2})(0[13578]|1[02])31)|((19|20)\d{2})02(0[1-9]|1\d|2[0-8])|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0229))\d{3})|((((\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((\d{2})(0[13578]|1[02])31)|((\d{2})02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[048])0229))\d{2}))(\d|X|x)$/.test(
                        value
                    )
                ) {
                    return new Error('请填写正确的身份证号');
                }
            }
        },
        workTime: {
            required: true,
            trigger: ['blur', 'change'],
            validator: (rule, value) => {
                if (!value) return new Error('请选择毕业年份');
            }
        },
        school: {
            required: true,
            trigger: ['blur', 'input'],
            message: '请填写本科学校'
        },
        major: {
            required: true,
            trigger: ['blur', 'input'],
            message: '请填写目前专业'
        },
        phone: {
            required: true,
            trigger: ['blur', 'input'],
            validator: (rule, value) => {
                if (!value) {
                    return new Error('请填写手机号码');
                } else if (!/^(?:(?:\+|00)86)?1\d{10}$/.test(value)) {
                    return new Error('请填写正确的手机号码');
                }
            }
        },
        email: {
            required: true,
            trigger: ['blur', 'input'],
            validator: (rule, value) => {
                if (!value) {
                    return new Error('请填写常用邮箱');
                } else if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {
                    return new Error('请填写正确的邮箱地址');
                }
            }
        },
        realName: {
            required: true,
            trigger: ['blur', 'input'],
            message: '请填写真实姓名'
        }
    }
};
const InputWidget: FunctionalComponent<{ type: keyof UserSignupInfo }> = props => {
    const { type } = props;
    signupData.value.userInfo.eduLevel = String(signupData.value.userInfo.eduLevel);
    switch (type) {
        case 'workTime':
            return createVNode(NSelect, {
                value: signupData.value.userInfo[type],
                placeholder: '',
                options: new Array(26).fill(0).map((item, index) => ({ value: index + 2000 + '', label: index + 2000 })),
                'onUpdate:value': (val: string) => {
                    signupData.value.userInfo[type] = val;
                }
            });
        case 'eduLevel':
            return createVNode(NSelect, {
                value: signupData.value.userInfo[type],
                placeholder: '',
                options: [
                    {
                        value: '1',
                        label: '高中'
                    },
                    {
                        value: '2',
                        label: '专科'
                    },
                    {
                        value: '3',
                        label: '本科'
                    },
                    {
                        value: '4',
                        label: '硕士'
                    },
                    {
                        value: '5',
                        label: '博士'
                    }
                ],
                'onUpdate:value': (val: string) => {
                    signupData.value.userInfo[type] = val;
                }
            });
        default:
            return createVNode(NInput, {
                value: signupData.value.userInfo[type],
                placeholder: '',
                'onUpdate:value': (val: string) => {
                    signupData.value.userInfo[type] = val;
                }
            });
    }
};

const handleBackHome = () => {
    router.push({ path: 'introduce', query: route.query });
};
const handleSignup = () => {
    signupForm.value?.validate(async error => {
        if (error) return;

        try {
            const { contestId, trackIds, userInfo, platform } = signupData.value;
            // const { data, msg } = await signup({ body: { contestId, trackIds, platform, userInfo: { ...userInfo, workTime: new Date(userInfo.workTime!).getFullYear().toString() } } });
            const { data, msg } = await signup({ body: { contestId, trackIds, platform, userInfo: { ...userInfo, workTime: userInfo.workTime } } });
            if (data?.signUpStatus === 1) {
                useMessage().success('报名成功');
                // 报名成功后刷新页面
                window.location.pathname = `${contestId}/introduce`;
            } else {
                throw msg;
            }
        } catch (error) {
            useMessage().error(error as string);
        }
    });
};
</script>

<template>
    <Section class="tw-p-9 tw-mt-10 tw-mb-10" title="报名规则">
        <div><strong>请阅读如下报名规则，务必保证填写的报名信息真实有效，否则将影响参赛和评奖：</strong></div>
        <div class="tw-whitespace-pre-wrap" v-html="appConfig?.signUpConf.content"></div>
    </Section>
    <NForm ref="signupForm" :model="signupData" :rules="rules" label-placement="left" label-width="auto" label-align="right" require-mark-placement="left" :style="{ width: '800px', margin: 'auto' }">
        <NGrid :cols="2" :x-gap="64">
            <NFormItemGridItem v-if="tracks.length > 1" label="赛道选择" path="trackIds" required>
                <NCheckboxGroup v-model:value="signupData.trackIds">
                    <NCheckbox v-for="track in tracks" :key="track.id" :value="track.id" :label="track.name" />
                </NCheckboxGroup>
            </NFormItemGridItem>
            <NFormItemGridItem v-for="field in fields" :key="field.type" :label="field.name" :path="`userInfo.${field.type}`" :required="field.type !== 'MDSchool'">
                <InputWidget :type="field.type" class="tw-w-full" />
            </NFormItemGridItem>
        </NGrid>
        <NGrid class="tw-mt-7" :cols="2" :x-gap="64">
            <NGridItem class="tw-w-[70%] tw-justify-self-center">
                <NButton class="tw-w-full" tertiary @click="handleBackHome">暂不报名，返回首页</NButton>
            </NGridItem>
            <NGridItem class="tw-w-[70%] tw-justify-self-center">
                <NButton class="tw-w-full" type="success" :color="themeColor" @click="handleSignup">填写完成，提交信息</NButton>
            </NGridItem>
        </NGrid>
    </NForm>
</template>
