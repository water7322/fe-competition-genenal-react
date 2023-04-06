/*eslint-disable */
export enum Source {
    /** 没有指定来源 */
    NONE = 'none',
    /** 主站，一般是 www.nowcoder.com */
    WWW = 'www',
    /** acm，一般是 acm.nowcoder.com */
    ACM = 'acm',
    /** 博客接口，一般是 blog.nowcoder.net */
    BLOG = 'blog',
    /** 移动端接口，一般是 m.nowcoder.com */
    WWWH5 = 'm',
    /** B端接口，一般是 api.nowcoder.com */
    API = 'api',
    /** 牛聘接口，一般是 nowpick.nowcoder.com */
    NOWPICK = 'nowpick',
    /** 题库中台 */
    QUESTION_BANK = 'questionBank',
    /** C 端网关 https://gw-c.nowcoder.com */
    GATEWAY_C = 'gateway_c',
    /** feed 接口 https://feed.nowcoder.com */
    FEED = 'feed',
}

export enum InterceptType {
    /** 处理请求数据 */
    REQUEST = 'request',
    /** 处理返回结果 */
    RESPONSE = 'response'
}

/*eslint-enable */
