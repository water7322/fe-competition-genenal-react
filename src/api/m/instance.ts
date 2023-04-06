import { create, Source, InterceptType } from '@/axios';
import type { NCAxiosRequestConfig } from '@/axios';
import ENV from '@/env.json';

const instance = create(Source.WWWH5);

// 请求前的拦截处理
instance.intercept(InterceptType.REQUEST, async config => {
    const { headers } = config;
    headers && delete headers['X-Requested-With'];
    config.baseURL = ENV[process.env.NODE_ENV || 'development'].M;

    return config;
});

// 返回前的拦截处理
instance.intercept(InterceptType.RESPONSE, async response => {
    const data = response.data as any;
    const config = response.config as NCAxiosRequestConfig;

    if (data.code === 999) {
        localStorage.setItem('login', 'false');
        // 根据接口配置字段或者参数ncNotNeedLogin控制弹出登录框
        if (config.ncNotNeedLogin !== true) {
            console.warn('需登录');
        }
    }
    if (data.code !== 0) console.error(data);

    return response;
});

export default instance;
