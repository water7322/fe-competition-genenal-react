import Axios, {AxiosInstance, AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse, Method} from 'axios';
import {Action, ActionResult, ActionParam, InterceptItem, InterceptCallback} from './type';
import {Source, InterceptType} from './source';

/**NCAxiosRequestConfig是否进行全局替换 
 * 是：原生axios的AxiosRequestConfig对象上添加一个自定义属性(并无什么影响)，后续扩展需要处理的细节较多
 * 否：请求中get在一般情况下不需要body，可以不进行替换put，delete，post都有存在body的可能需要替换，拦截器？可以进行替换(后续需要维护成本，影响范围会扩大) : 不替换(缩小影响范围) 
 */
export interface NCAxiosRequestConfig extends AxiosRequestConfig {
    /** true 表示兼容Content-Type:application/x-www-form-urlencoded传递参数需要使用qs.stringify() */
    needUrlEncoded?: Boolean;
    /** true 表示不加时间戳 */ 
    cache?: Boolean;
    [key: string]: any
}

const poll: Record<string, NCAxios> = {};

/** 创建实例 */
export function create(): NCAxios;
export function create(config: AxiosRequestConfig): NCAxios;
export function create(name: Source, config?: AxiosRequestConfig): NCAxios;
export function create(name?: Source | AxiosRequestConfig, config?: AxiosRequestConfig): NCAxios {
    const isString = typeof name === 'string';
    const _name: any = (isString ? name : '') || Source.NONE;
    const _config: any = isString ? config : name;
    let instance = poll[_name];
    if (!instance) {
        instance = new NCAxios(_name, _config);
        poll[_name] = instance;
    } else {
        // 在第一个请求发起前可以修改通用配置
        // 用于在npm中使用nc.axios对象，但是在业务代码中进行配置
        // 请求发起(真实axios被实例化)后，需要修改配置通过单个接口后面单独配置
        instance.adjustConfig(_config);
    }
    return instance;
}

export class NCAxios {
    private name: Source = Source.NONE;
    private _instance?: AxiosInstance;
    private _config: AxiosRequestConfig;
    private intercepts: InterceptItem[] = [];

    constructor(name: Source, config: AxiosRequestConfig) {
        this.name = name;
        this._config = config;
    }

    /** axios默认配置项 */
    get config() {
        return {
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            timeout: 20000,
            withCredentials: true,
            ...this._config
        };
    }

    private get instance() {
        // 这里通过只读属性传递出去
        // 1. 避免外界修改
        // 2. 保留动态修改实例的权限
        !this._instance && (this._instance = Axios.create(this.config));
        return this._instance!;
    }

    adjustConfig(config: AxiosRequestConfig) {
        this._config = {...this._config, ...config};
    }

    /** 增加请求之前的拦截 */
    intercept(type: InterceptType.REQUEST, callback: InterceptCallback<AxiosRequestConfig>): Function;
    /** 增加请求结果之前的拦截 */
    // eslint-disable-next-line
    intercept(type: InterceptType.RESPONSE, callback: InterceptCallback<AxiosResponse>): Function;
    // eslint-disable-next-line
    intercept(type: InterceptType, callback: InterceptCallback<AxiosRequestConfig> | InterceptCallback<AxiosResponse>): Function {
        return this.addIntercept(type, false, callback);
    }

    /** 增加请求/结果错误处理的拦截 */
    error(type: InterceptType, callback: (error: any) => any): Function {
        return this.addIntercept(type, true, callback);
    }

    private addIntercept(type: InterceptType, forError: boolean, callback: any): Function {
        const instance = this.instance;
        const item: InterceptItem = {type, forError: forError, callback};
        const intercept: AxiosInterceptorManager<AxiosRequestConfig | AxiosResponse> = type === InterceptType.REQUEST ? instance.interceptors.request : instance.interceptors.response;
        item.id = addIntercept(instance, item);
        this.intercepts.push(item);
        return () => {
            this.intercepts = this.intercepts.filter(temp => {
                if (temp !== item) return true;
                temp.id && intercept.eject(temp.id);
                return false;
            });
        };
    }

    register<ResultData, Param = any, Query = any, Body = any>(method: Method, url: string): Action<ResultData, Param, Query, Body>;
    // eslint-disable-next-line
    register<ResultData, Param = any, Query = any, Body = any>(config: NCAxiosRequestConfig): Action<ResultData, Param, Query, Body>;
    // eslint-disable-next-line
    register<ResultData, Param = any, Query = any, Body = any>(method: Method | NCAxiosRequestConfig, url?: string): Action<ResultData, Param, Query, Body> {
        // 注意，内部 _config 修改，不能影响外面的共同 config
        return (params?: ActionParam<Param, Query, Body>): Promise<ActionResult<ResultData>> => {
            let instance = this.instance;
            // 定义config 如果有嵌套对象，则仍会被共用这个嵌套对象
            let _config: NCAxiosRequestConfig = typeof method === 'string' ? {method, url} : {...method};
            // 需要转换成字符串，再trim，否则会抛异常
            _config.url = _config.url?.replace(/#{(.*?)}/g, (_, name: string) => (`${params?.param?.[name] ?? ''}`).trim());
            _config.data = params?.body;
            _config.params = params?.query;
            params?.config && Object.assign(_config, params?.config);
            if (params?.instance) {
                instance = Axios.create(this.config);
                params.instance(instance, [...this.intercepts]);
            }
            return this.request<ResultData>(_config, instance, params?.reject);
        };
    }

    /** 发送请求 */
    async request<ResultData>(config: NCAxiosRequestConfig, instance?: AxiosInstance, reject: boolean = false): Promise<ActionResult<ResultData>> {
        instance = instance || this.instance;
        // 为了减少业务代码里的类型推断 如 let data = res.data!
        let result: ActionResult = {code: -1, data: undefined, msg: '服务异常，请稍后重试', message: '服务异常，请稍后重试', error: true};
        try {
            /**使用qs.stringify将body封装成默认浏览器支持的application/x-www-form-urlencoded，arrayFormat: 'repeat'处理数组形式 */
            config.needUrlEncoded && config.data && (config.data = getQuery(config.data));
            config.cache !== true && (config.params = {...config.params, _: new Date().getTime()});
            config && (config.paramsSerializer = params => getQuery(params))
            /**将原本不属于原生axios AxiosRequestConfig的多余字段处理掉 */
            const configTemp = {...config};
            delete configTemp.needUrlEncoded;
            delete configTemp.cache;

            let response = await instance.request<ActionResult<ResultData>>(configTemp);
            const data = response?.data;
            if (data) {
                if (typeof data === 'string') result = json(data, result);
                else result = data;
            }
            if (result.code === 0) {
                // 1、http响应码在2xx以内、code 成功码 0
                result.error = false;
                result.msg ??= result.message || '';
            } else {
                // 2、http响应码在2xx以内、code 失败码，如自定义的code码
                result.error = response || true;
            }
        } catch (error: any) {
            // 3、http请求成功且响应也成功，但后端返回http响应码在2xx以外
            if (typeof error?.response?.data === 'object') {
                result = error.response.data;
            }
            // 4、请求失败(如404)、后端服务异常（如500 服务器/接口崩溃）等
            result.msg ??= error?.message;
            result.error = error || true;
        }

        result.code ??= -1;
        result.msg ??= result.message;
        if (!result.error || !reject) return result;
        return Promise.reject(result);
    }

    /** 创建 get 请求 */
    get<ResultData, Query = any, Param = any>(url: string, config?: NCAxiosRequestConfig): Action<ResultData, Param, Query, any> {
        return this.register<ResultData>({...config, method: 'get', url});
    }

    /** 创建 post 请求 */
    post<ResultData, Body = any, Param = any, Query = any>(url: string, config?: NCAxiosRequestConfig): Action<ResultData, Param, Query, Body> {
        return this.register<ResultData>({...config, method: 'post', url});
    }

    /** 创建 put 请求 */
    put<ResultData, Body = any, Param = any, Query = any>(url: string, config?: NCAxiosRequestConfig): Action<ResultData, Param, Query, Body> {
        return this.register<ResultData>({...config, method: 'put', url});
    }

    /** 创建 delete 请求 */
    delete<ResultData, Body = any, Param = any, Query = any>(url: string, config?: NCAxiosRequestConfig): Action<ResultData, Param, Query, Body> {
        return this.register<ResultData>({...config, method: 'delete', url});
    }
}

/** 给 axios 实例绑定牛客拦截对象 */
export function addIntercept(instance: AxiosInstance, item: InterceptItem): number {
    const callback = item.callback as any;
    const intercept: AxiosInterceptorManager<NCAxiosRequestConfig | AxiosResponse> = item.type === InterceptType.REQUEST ? instance.interceptors.request : instance.interceptors.response;
    if (item.forError) return intercept.use(undefined, callback);
    return intercept.use(callback);
}

function json(str: string, defaultVal?: any) {
    defaultVal = defaultVal || null;
    try {
        return str ? JSON.parse(str) : defaultVal;
    } catch (e1) {
        try {
            var rvalidchars = /^[\],:{}\s]*$/;
            var rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g;
            var rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g;
            var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
            if (rvalidchars.test(str.replace(rvalidescape, '@').replace(rvalidtokens, ']').replace(rvalidbraces, ''))) {
                return new Function('return ' + str)();
            }
        } catch (e2) {}
    }
    return defaultVal;
}

/**
 * @description 将对象转换为params
 * @param param object
 * @returns string
 * 测试：单独参数的形式 done
 * 测试：数组参数的形式 done
 */
function getQuery(param?: Record<string, any>) {
    if(!param) return '';
    let arrayParams:string[] = [];
    for (const key in param) {
        let item = _val(key, param[key]);
        item && arrayParams.push(item);
    }
    return arrayParams.join('&');
/**处理数组形式的参数 */
    function _val(key, val) {
        if (Array.isArray(val)) {
            let item = val.filter(str => (str !== undefined && str !== null)).map(str => key + '=' + encodeURIComponent(str))
            return item.length === 0 ? '' : item.join('&');
        }
        return val === undefined || val === null ? '' : key + '=' + encodeURIComponent(val);
    }
}