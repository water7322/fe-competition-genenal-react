import {AxiosInstance, AxiosError, AxiosResponse} from 'axios';
import {InterceptType} from './source';
import {NCAxiosRequestConfig} from './axios';

/** 请求接口 */
export interface Action<ResultData, Param = any, Query = any, Body = any> {
    (params?: ActionParam<Param, Query, Body>): Promise<ActionResult<ResultData>>;
}

/** 后端返回格式 */
export interface ActionResult<ResultData = any> {
    /** code: 0 表示成功、-1 表示失败；其它失败 如401、402等 */
    code: string | number;
    /** 具体的数据 */
    data: ResultData;
    /** 出错说明 */
    msg: string;
    /** 同 msg */
    message: string;
    /** 前端通过error判断结果是否成功; 只有请求发送成功 && 后端返回code=0时，error才为false */
    error: boolean | AxiosError | AxiosResponse;
    // 注意，如果一个项目跨多个后端服务访问接口时，可能每个后端项目格式不一样，需要在此扩展定义
}

export interface ActionParam<Param = any, Query = any, Body = any> {
    /** 链接参数，比如 /user/#{id}/info */
    param?: Param;
    /** 链接请求参数，一般用在 get */
    query?: Query;
    /** body参数，一般用在 post/put/delete */
    body?: Body;
    /** true: 请求失败(包括后端错误)使用reject返回 */
    reject?: boolean;
    /** 额外的请求设置 */
    config?: NCAxiosRequestConfig;
    /** 使用新的axios实例发送请求 */
    instance?: ((instance: AxiosInstance, interceptors: InterceptItem[]) => void) | null;
}

export type InterceptCallback<T> = (value: T) => T | Promise<T>;

export interface InterceptItem {
    type: InterceptType;
    forError: boolean;
    callback: Function;
    id?: number;
}
